import type { FC } from "react";
import type { MonthData } from "../types/app.types";
import { Edit, Folder, PlusCircle, Trash2 } from "lucide-react";
import formatCurrency from "../utils/formatCurrency";
import type { ModalState } from "../types/modal.types";

interface MonthlyPageProps {
	year: string;
	month: string;
	data: MonthData;
	onOpenModal: (state: ModalState) => void;
	onDelete: (type: "expense" | "income", id: string) => void;
}

export const MonthlyPage: FC<MonthlyPageProps> = ({ year, month, data, onOpenModal, onDelete }) => (
	<div className='p-8'>
		<div className='flex items-center mb-6'>
			<Folder className='w-8 h-8 mr-3 text-yellow-500' />
			<h2 className='text-3xl font-bold text-gray-800'>
				{month} {year}
			</h2>
			<button
				onClick={() => onOpenModal({ mode: "add", type: "income" })}
				className='pl-4 flex items-center text-sm text-green-600 hover:text-green-800 font-semibold'
			>
				<PlusCircle className='w-4 h-4 mr-1' /> Add Income
			</button>
		</div>

		<div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
			<div className='bg-white p-6 rounded-xl shadow-sm'>
				<h3 className='text-gray-500'>Income</h3>
				<p
					className={`text-3xl font-semibold ${
						data.income === 0 ? "text-gray-700" : data.income > 0 ? "text-green-700" : "text-red-700"
					} mt-2`}
				>
					{formatCurrency(data.income)}
				</p>
			</div>
			<div className='bg-white p-6 rounded-xl shadow-sm'>
				<h3 className='text-gray-500'>Expenses</h3>
				<p
					className={`text-3xl font-semibold ${
						data.expenses === 0 ? "text-gray-700" : data.expenses > 0 ? "text-green-700" : "text-red-700"
					} mt-2`}
				>
					{formatCurrency(data.expenses)}
				</p>
			</div>
			<div className='bg-white p-6 rounded-xl shadow-sm'>
				<h3 className='text-gray-500'>Net Savings</h3>
				<p
					className={`text-3xl font-semibold ${
						data.net === 0 ? "text-gray-700" : data.net > 0 ? "text-green-700" : "text-red-700"
					} mt-2`}
				>
					{formatCurrency(data.net)}
				</p>
			</div>
		</div>
		<div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
			<div className='bg-white p-6 rounded-xl shadow-sm'>
				<div className='flex justify-between items-center mb-4'>
					<h3 className='text-xl font-semibold text-gray-700'>Recurring Expenses</h3>
					<button
						onClick={() => onOpenModal({ mode: "add", type: "expense", data: { isRecurring: true } })}
						className='flex items-center text-sm text-blue-600 hover:text-blue-800 font-semibold'
					>
						<PlusCircle className='w-4 h-4 mr-1' /> Add Expense
					</button>
				</div>
				<ul className='divide-y divide-gray-200'>
					{data.recurring.map((exp, i) => (
						<li key={i} className='py-3 flex justify-between items-center group'>
							<span className='text-gray-600'>{exp.name}</span>
							<div className='flex items-center'>
								<span className='font-medium text-gray-800 mr-4'>{formatCurrency(exp.amount)}</span>
								<div className='flex space-x-2 transition-all'>
									<button
										onClick={() => onOpenModal({ mode: "edit", type: "expense", data: { id: exp.id } })}
										className='text-gray-400 hover:text-blue-600'
									>
										<Edit className='w-4 h-4' />
									</button>
									<button onClick={() => onDelete("expense", exp.id)} className='text-gray-400 hover:text-red-600'>
										<Trash2 className='w-4 h-4' />
									</button>
								</div>
							</div>
						</li>
					))}
				</ul>
			</div>
			<div className='bg-white p-6 rounded-xl shadow-sm'>
				<div className='flex justify-between items-center mb-4'>
					<h3 className='text-xl font-semibold text-gray-700'>One-Time Expenses</h3>
					<button
						onClick={() => onOpenModal({ mode: "add", type: "expense", data: { isRecurring: false } })}
						className='flex items-center text-sm text-blue-600 hover:text-blue-800 font-semibold'
					>
						<PlusCircle className='w-4 h-4 mr-1' /> Add Expense
					</button>
				</div>
				<ul className='divide-y divide-gray-200'>
					{data.oneTime.map((exp, i) => (
						<li key={i} className='py-3 flex justify-between items-center group'>
							<span className='text-gray-600'>{exp.name}</span>
							<div className='flex items-center'>
								<span className='font-medium text-gray-800 mr-4'>{formatCurrency(exp.amount)}</span>
								<div className='flex space-x-2 transition-all'>
									<button
										onClick={() => onOpenModal({ mode: "edit", type: "expense", data: { id: exp.id } })}
										className='text-gray-400 hover:text-blue-600'
									>
										<Edit className='w-4 h-4' />
									</button>
									<button onClick={() => onDelete("expense", exp.id)} className='text-gray-400 hover:text-red-600'>
										<Trash2 className='w-4 h-4' />
									</button>
								</div>
							</div>
						</li>
					))}
				</ul>
			</div>
		</div>
	</div>
);
