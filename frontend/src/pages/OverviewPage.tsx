import type { FC } from "react";
import type { FormattedGoal, OverviewData } from "../types/app.types";
import formatCurrency from "../utils/formatCurrency";
import { PlusCircle } from "lucide-react";

interface OverviewPageProps {
	data: OverviewData;
	goals: FormattedGoal[];
}

export const OverviewPage: FC<OverviewPageProps> = ({ data, goals }) => (
	<div className='p-8'>
		<h2 className='text-3xl font-bold text-gray-800 mb-6'>Overview</h2>
		<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
			<div className='bg-white p-6 rounded-xl shadow-sm'>
				<h3 className='text-gray-500'>Total Savings</h3>
				<p
					className={`text-3xl font-semibold ${
						data.totalSavings === 0 ? "text-gray-700" : data.totalSavings > 0 ? "text-green-700" : "text-red-700"
					} mt-2`}
				>
					{formatCurrency(data.totalSavings)}
				</p>
			</div>
			<div className='bg-white p-6 rounded-xl shadow-sm'>
				<h3 className='text-gray-500'>Monthly Income</h3>
				<p
					className={`text-3xl font-semibold ${
						data.monthlyIncome === 0 ? "text-gray-700" : data.monthlyIncome > 0 ? "text-green-700" : "text-red-700"
					} mt-2`}
				>
					{formatCurrency(data.monthlyIncome)}
				</p>
			</div>
			<div className='bg-white p-6 rounded-xl shadow-sm'>
				<h3 className='text-gray-500'>Monthly Expenses</h3>
				<p
					className={`text-3xl font-semibold ${
						data.monthlyExpenses === 0 ? "text-gray-700" : data.monthlyExpenses > 0 ? "text-green-700" : "text-red-700"
					} mt-2`}
				>
					{formatCurrency(data.monthlyExpenses)}
				</p>
			</div>
			<div className='bg-white p-6 rounded-xl shadow-sm'>
				<h3 className='text-gray-500'>Net Savings (proj.)</h3>
				<p
					className={`text-3xl font-semibold ${
						data.netSavings === 0 ? "text-gray-700" : data.netSavings > 0 ? "text-green-700" : "text-red-700"
					} mt-2`}
				>
					{formatCurrency(data.netSavings)}
				</p>
			</div>
		</div>
		<div className='mt-10 grid grid-cols-1 md:grid-cols-2 gap-8'>
			<div className='bg-white p-6 rounded-xl shadow-sm'>
				<div className='flex justify-between items-center mb-4'>
					<h3 className='text-xl font-semibold text-gray-700'>Goals Progress</h3>
					<button className='flex items-center text-sm text-blue-600 hover:text-blue-800 font-semibold'>
						<PlusCircle className='w-4 h-4 mr-1' /> Add Goal
					</button>
				</div>
				<div className='space-y-4'>
					{goals.map((goal) => (
						<div key={goal.id}>
							<div className='flex justify-between mb-1'>
								<span className='text-base font-medium text-gray-700'>{goal.name}</span>
								<span className='text-sm font-medium text-gray-500'>
									{formatCurrency(goal.current)} / {formatCurrency(goal.target)}
								</span>
							</div>
							<div className='w-full bg-gray-200 rounded-full h-2.5'>
								<div
									className='bg-blue-600 h-2.5 rounded-full'
									style={{ width: `${(goal.current / goal.target) * 100}%` }}
								></div>
							</div>
						</div>
					))}
				</div>
			</div>
			<div className='bg-white p-6 rounded-xl shadow-sm'>
				<div className='flex justify-between items-center mb-4'>
					<h3 className='text-xl font-semibold text-gray-700'>Upcoming Expenses</h3>
					<button className='flex items-center text-sm text-blue-600 hover:text-blue-800 font-semibold'>
						<PlusCircle className='w-4 h-4 mr-1' /> Add Expense
					</button>
				</div>

				<ul className='divide-y divide-gray-200'>
					{data.upcomingExpenses.map((exp) => (
						<li key={exp.name} className='py-3 flex justify-between items-center'>
							<span className='text-gray-600'>{exp.name}</span>
							<span className='font-medium text-gray-800'>
								{formatCurrency(exp.amount)} <span className='text-sm text-gray-400 font-normal'>due {exp.due}</span>
							</span>
						</li>
					))}
				</ul>
			</div>
		</div>
	</div>
);
