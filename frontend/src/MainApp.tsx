import { useEffect, useState, type FC } from "react";
import type { ApiExpense, ApiGoal, ApiIncome, ApiUser } from "./types/api.types";
import { LoaderCircle } from "lucide-react";

import type { AppData, ViewState } from "./types/app.types";
import { apiRequest } from "./network/apiRequest";
import { formatApiData } from "./utils/formatApiData";
import { SideBar } from "./components/SideBar";
import { OverviewPage } from "./pages/OverviewPage";
import { MonthlyPage } from "./pages/MonthlyPage";
import { GoalsPage } from "./pages/GoalsPage";
import { DataEntryModal } from "./components/DataEntryModal";
import type { ModalState } from "./types/modal.types";

interface MainAppProps {
	user: ApiUser;
	onLogout: () => void;
}
const MainApp: FC<MainAppProps> = ({ user, onLogout }) => {
	const [currentView, setCurrentView] = useState<ViewState>({ type: "overview" });
	const [appData, setAppData] = useState<AppData | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [modalState, setModalState] = useState<ModalState>(null);

	const fetchAllData = async () => {
		try {
			setLoading(true);
			const [incomes, expenses, goals] = await Promise.all([
				apiRequest<ApiIncome[]>("/incomes"),
				apiRequest<ApiExpense[]>("/expenses"),
				apiRequest<ApiGoal[]>("/goals"),
			]);
			setAppData(formatApiData(incomes, expenses, goals));
			setError(null);
		} catch (err: any) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchAllData();
	}, []);

	const handleOpenModal = (state: ModalState) => {
		if (state && state.mode === "edit") {
			const { type, data } = state;
			let fullData;
			if (type === "expense") fullData = appData?.raw.expenses.find((e) => e._id === data.id);
			else if (type === "income") fullData = appData?.raw.incomes.find((i) => i._id === data.id);
			else if (type === "goal") fullData = appData?.raw.goals.find((g) => g._id === data.id);
			else fullData = data;
			setModalState({ ...state, data: fullData || data });
		} else {
			setModalState(state);
		}
	};

	const handleDelete = async (type: "expense" | "income" | "goal", id: string) => {
		if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
			try {
				await apiRequest(`/${type}s/${id}`, "DELETE");
				await fetchAllData();
			} catch (err: any) {
				alert(`Failed to delete: ${err.message}`);
			}
		}
	};

	const renderContent = () => {
		if (loading)
			return (
				<div className='flex items-center justify-center h-full'>
					<LoaderCircle className='w-12 h-12 animate-spin text-blue-600' />
				</div>
			);
		if (error)
			return (
				<div className='p-8 text-center text-red-600'>
					<h2 className='text-2xl font-bold mb-4'>Failed to load data</h2>
					<p>{error}</p>
				</div>
			);
		if (!appData) return <div className='p-8 text-center text-gray-500'>No data available. Add your first entry!</div>;

		const mainContentClass = modalState ? "blur-sm" : "";

		switch (currentView.type) {
			case "overview":
				return (
					<div className={mainContentClass}>
						<OverviewPage data={appData.overview} goals={appData.goals} />
					</div>
				);
			case "month": {
				const { year, month } = currentView;
				const monthData = appData.years[year]?.[month];
				if (!monthData)
					return (
						<div className='p-8'>
							No data for {month} {year}.
						</div>
					);
				return (
					<div className={mainContentClass}>
						<MonthlyPage
							year={year}
							month={month}
							data={monthData}
							onOpenModal={handleOpenModal}
							onDelete={handleDelete}
						/>
					</div>
				);
			}

			case "goals":
				return (
					<div className={mainContentClass}>
						<GoalsPage goals={appData.goals} onOpenModal={handleOpenModal} onDelete={handleDelete} />
					</div>
				);
			default:
				return (
					<div className={mainContentClass}>
						<OverviewPage data={appData.overview} goals={appData.goals} />
					</div>
				);
		}
	};
	return (
		<>
			<div className='flex bg-gray-100 font-sans'>
				<SideBar onSelect={setCurrentView} years={appData?.years || {}} onLogout={onLogout} user={user} />
				<main className='flex-1 h-screen overflow-y-auto'>{renderContent()}</main>
			</div>
			<DataEntryModal modalState={modalState} onClose={() => setModalState(null)} onSave={fetchAllData} />
		</>
	);
};

export default MainApp;
