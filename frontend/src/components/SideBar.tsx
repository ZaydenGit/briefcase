import { useState, type FC } from "react";
import type { ViewState, Years } from "../types/app.types";
import { ChevronDown, ChevronRight, Folder, LayoutDashboard, LogOut, Target } from "lucide-react";
import type { ApiUser } from "../types/api.types";

interface SidebarProps {
	onSelect: (view: ViewState) => void;
	years: Years;
	onLogout: () => void;
	user: ApiUser;
}

export const SideBar: FC<SidebarProps> = ({ onSelect, years, onLogout, user }) => {
	const { username } = user;
	const sortedYears = Object.keys(years).sort((a, b) => parseInt(b) - parseInt(a));
	console.log(sortedYears);
	const initialOpenState = sortedYears.reduce((acc, year, index) => {
		acc[year] = index === 0;
		return acc;
	}, {} as { [key: string]: boolean });

	const [openYears, setOpenYears] = useState(initialOpenState);
	const toggleYear = (year: string) => {
		setOpenYears((prev) => ({ ...prev, [year]: !prev[year] }));
	};
	return (
		<div className='flex-col flex w-64 bg-gray-50 h-screen p-4'>
			<h1 className='text-2xl font-bold text-gray-800 mb-8'>Briefcase</h1>
			<nav className='flex-col flex-grow flex space-y-2'>
				<a
					href='#'
					onClick={() => onSelect({ type: "overview" })}
					className='flex items-center text-gray-600 p-2 hover:bg-gray-200 rounded-lg transition-colors'
				>
					<LayoutDashboard className='w-5 h-5 mr-3' />
					Overview
				</a>
				{sortedYears.map((year) => (
					<div key={year}>
						<div
							onClick={() => toggleYear(year)}
							className='flex items-center p-2 text-gray-600 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors'
						>
							{openYears[year] ? <ChevronDown className='w-5 h-5 mr-3' /> : <ChevronRight className='w-5 h-5 mr-3' />}
							<Folder className='w-5 h-5 mr-2 text-yellow-500' /> {year}
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
				<a
					href='#'
					onClick={() => onSelect({ type: "goals" })}
					className='flex items-center text-gray-600 p-2 hover:bg-gray-200 rounded-lg transition-colors'
				>
					<Target className='w-5 h-5 mr-3 text-green-500' /> Goals
				</a>
			</nav>
			<div className='mt-auto'>
				<div className='p-2 text-sm text-gray-500'>
					Signed in as <span className='font-semibold'>{username}</span>
				</div>
				<a
					href='#'
					onClick={onLogout}
					className='flex items-center p-2 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors'
				>
					<LogOut className='w-5 h-5 mr-3' /> Logout
				</a>
			</div>
		</div>
	);
};
