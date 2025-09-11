import { useState, type FC } from "react";
import type { ViewState, Years } from "../types/app.types";
import {
	Briefcase,
	ChevronDown,
	ChevronRight,
	ChevronsLeft,
	Folder,
	LayoutDashboard,
	LogOut,
	PlusCircle,
	Target,
} from "lucide-react";
import type { ModalState } from "../types/modal.types";

interface SidebarProps {
	onSelect: (view: ViewState) => void;
	years: Years;
	onLogout: () => void;
	username: string;
	onOpenModal: (state: ModalState) => void;
	navigate: (path: string) => void;
	isCollapsed: boolean;
	setIsCollapsed: (isCollapsed: boolean) => void;
}
export const SideBar: FC<SidebarProps> = ({
	onSelect,
	years,
	onLogout,
	username,
	onOpenModal,
	navigate,
	isCollapsed,
	setIsCollapsed,
}) => {
	const sortedYears = Object.keys(years).sort((a, b) => parseInt(b) - parseInt(a));
	const [openYears, setOpenYears] = useState(
		sortedYears.reduce((acc, year, i) => ({ ...acc, [year]: i === 0 }), {} as { [key: string]: boolean })
	);

	const toggleYear = (year: string) => {
		if (isCollapsed) setIsCollapsed(false);
		setOpenYears((p) => ({ ...p, [year]: !p[year] }));
	};

	const NavLink: FC<{ icon: React.ReactNode; text: string; onClick: () => void }> = ({ icon, text, onClick }) => (
		<a
			href='#'
			onClick={onClick}
			className='flex items-center p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors group'
		>
			{icon}
			<span
				className={`ml-3 whitespace-nowrap transition-opacity duration-300 ${
					isCollapsed ? "opacity-0" : "opacity-100"
				}`}
			>
				{text}
			</span>
		</a>
	);

	return (
		<aside
			className={`bg-gray-50 h-screen flex flex-col border-r border-gray-200 transition-all duration-300 ease-in-out ${
				isCollapsed ? "w-20" : "w-64"
			}`}
		>
			<div className={`p-4 flex items-center ${isCollapsed ? "justify-center" : "justify-between"}`}>
				<a
					href='#'
					onClick={() => navigate("/")}
					className={`flex items-center transition-all duration-300 ${isCollapsed ? "w-0 overflow-hidden" : "w-auto"}`}
				>
					<Briefcase className='w-8 h-8 text-blue-600 flex-shrink-0 hover:scale-115 hover:text-bold hover:text-blue-800 hover:rotate-6 transition-all ease-in-out duration-75' />
					<span className='text-2xl font-bold text-gray-800 ml-2 whitespace-nowrap'>Briefcase</span>
				</a>
				<button onClick={() => setIsCollapsed(!isCollapsed)} className='p-1 rounded-lg hover:bg-gray-200'>
					<ChevronsLeft className={`transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`} />
				</button>
			</div>

			<div className={`px-4 ${isCollapsed ? "py-4" : "pb-4"}`}>
				<button
					onClick={() => onOpenModal({ mode: "add", type: "income" })}
					className={`w-full flex items-center justify-center p-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors`}
				>
					<PlusCircle className={`w-5 h-5 flex-shrink-0 ${!isCollapsed ? "mr-2" : ""}`} />
					<span
						className={`transition-opacity duration-300 whitespace-nowrap ${
							isCollapsed ? "opacity-0 w-0" : "opacity-100"
						}`}
					>
						Add New
					</span>
				</button>
			</div>

			<nav className='flex-grow px-4 overflow-y-auto overflow-x-hidden'>
				<NavLink
					icon={<LayoutDashboard className='w-5 h-5 flex-shrink-0' />}
					text='Overview'
					onClick={() => onSelect({ type: "overview" })}
				/>
				{!isCollapsed &&
					sortedYears.map((year) => (
						<div key={year}>
							<div
								onClick={() => toggleYear(year)}
								className='flex items-center p-2 text-gray-600 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors'
							>
								{openYears[year] ? <ChevronDown className='w-5 h-5 mr-3' /> : <ChevronRight className='w-5 h-5 mr-3' />}
								<Folder className='w-5 h-5 mr-2 text-yellow-500' />
								{year}
							</div>
							{openYears[year] && (
								<div className='ml-8 mt-1 border-l border-gray-300'>
									{Object.keys(years[year]).map((month) => (
										<a
											href='#'
											key={month}
											onClick={() => onSelect({ type: "month", year, month })}
											className='block pl-4 pr-2 py-1 text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded-r-lg transition-colors'
										>
											{month}
										</a>
									))}
								</div>
							)}
						</div>
					))}
				<NavLink
					icon={<Target className='w-5 h-5 text-green-500 flex-shrink-0' />}
					text='Goals'
					onClick={() => onSelect({ type: "goals" })}
				/>
			</nav>

			<div className='mt-auto border-t border-gray-200'>
				<div className={`p-4 overflow-hidden ${isCollapsed ? "w-0 hidden" : "w-auto"}`}>
					<div className='text-sm text-gray-500'>Signed in as</div>
					<div className='font-semibold truncate'>{username}</div>
				</div>
				<NavLink icon={<LogOut className='w-5 h-5 flex-shrink-0' />} text='Logout' onClick={onLogout} />
			</div>
		</aside>
	);
};
