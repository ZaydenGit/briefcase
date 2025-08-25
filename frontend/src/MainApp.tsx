import { useEffect, useState, type FC } from "react";
import type { ApiExpense, ApiGoal, ApiIncome, ApiUser } from "./types/api.types";
import { LoaderCircle } from "lucide-react";

import type { AppData, ViewState } from "./types/app.types";
import { apiRequest } from "./network/apiRequest";
import { formatApiData } from "./utils/formatApiData";
import { SideBar } from "./components/SideBar";
import { OverviewPage } from "./pages/OverviewPage";
import { MonthlyPage } from "./pages/MonthlyPage";

interface MainAppProps {
	user: ApiUser;
	onLogout: () => void;
}

const MainApp: FC<MainAppProps> = ({ user, onLogout }) => {
	const [currentView, setCurrentView] = useState<ViewState>({ type: "overview" });
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [appData, setAppData] = useState<AppData | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [incomes, expenses, goals] = await Promise.all([
					apiRequest<ApiIncome[]>("/incomes"),
					apiRequest<ApiExpense[]>("/expenses"),
					apiRequest<ApiGoal[]>("/goals"),
				]);
				// await formatApiData(incomes, expenses, goals);
				setAppData(await formatApiData(incomes, expenses, goals));
			} catch (err: any) {
				console.error("Failed to fetch data", err);
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	const render = () => {
		if (loading)
			return (
				<div className='flex items-center justify-center h-full'>
					<LoaderCircle className='w-12 h-12 animate-spin text-blue-500' />
				</div>
			);

		if (error)
			return (
				<div className='text-center p-8 text-red-600'>
					<h2 className='text-2xl font-bold mb-4'>Failed to load</h2>
					<p>{error}</p>
				</div>
			);
		if (!appData) return <div className='text-center p-8 text-red-600'>Error loading data or no data available</div>;

		switch (currentView.type) {
			case "overview":
				return <OverviewPage data={appData.overview} goals={appData.goals} />;
			case "month": {
				const { year, month } = currentView;
				const monthData = appData.years[year]?.[month];
				if (!monthData)
					return (
						<div className=''>
							No data for {month} {year}
						</div>
					);
				return <MonthlyPage year={year} month={month} data={monthData} />;
			}

			case "goals":
				return;
			default:
				return <OverviewPage data={appData.overview} goals={appData.goals} />;
		}
	};

	return (
		<div className='flex bg-gray-100 font-sans'>
			<SideBar onSelect={setCurrentView} years={appData?.years || {}} onLogout={onLogout} user={user} />
			<main className='flex-1 h-screen overflow-y-auto'>{render()}</main>
		</div>
	);
};

export default MainApp;
