import type { FC } from "react";
import type { FormattedGoal } from "../types/app.types";
import { Edit, PlusCircle, Target, Trash2 } from "lucide-react";
import formatCurrency from "../utils/formatCurrency";
import type { ModalState } from "../types/modal.types";

interface GoalsPageProps {
	goals: FormattedGoal[];
	onOpenModal: (state: ModalState) => void;
	onDelete: (type: "expense" | "income" | "goal", id: string) => void;
}

export const GoalsPage: FC<GoalsPageProps> = ({ goals, onOpenModal, onDelete }) => (
	<div className='p-8'>
		<div className='flex justify-between items-center mb-6'>
			<div className='flex items-center'>
				<Target className='w-8 h-8 mr-3 text-green-500' /> <h2 className='text-3xl font-bold text-gray-800'>Goals</h2>
			</div>
			<button
				onClick={() => onOpenModal({ mode: "add", type: "goal" })}
				className='flex items-center text-sm text-blue-600 hover:text-blue-800 font-semibold'
			>
				<PlusCircle className='w-4 h-4 mr-1' /> Add Goal
			</button>
		</div>
		<div className='space-y-6'>
			{goals.map((goal) => (
				<div key={goal.id} className='bg-white p-6 rounded-xl shadow-sm'>
					<div className='flex flex-col md:flex-row md:items-center md:justify-between'>
						<div>
							<h3 className='text-xl font-semibold text-gray-800'>{goal.name}</h3>
							<p className='text-gray-500 mt-1'>
								Contributes: {goal.contribution ? `${formatCurrency(goal.contribution)}/mo` : "None"}
							</p>
						</div>
						<div className='mt-4 md:mt-0 md:w-1/2'>
							<div className='flex justify-between mb-1'>
								<span className='text-base font-medium text-blue-700'>Progress</span>
								<span className='text-sm font-medium text-gray-500'>
									{formatCurrency(goal.current)} of {formatCurrency(goal.target)} (
									{Math.round((goal.current / goal.target) * 100)}%)
								</span>
							</div>
							<div className='w-full bg-gray-200 rounded-full h-4'>
								<div
									className='bg-blue-600 h-4 rounded-full'
									style={{ width: `${(goal.current / goal.target) * 100}%` }}
								></div>
							</div>
						</div>
					</div>
					<div className='mt-4 flex justify-end items-center space-x-4'>
						<button
							onClick={() => onOpenModal({ mode: "add", type: "contribution", data: goal })}
							className='flex items-center text-sm text-blue-600 hover:text-blue-800 font-semibold'
						>
							<PlusCircle className='w-4 h-4 mr-1' /> Add Contribution
						</button>
						<button
							onClick={() => onOpenModal({ mode: "edit", type: "goal", data: goal })}
							className='text-gray-400 hover:text-blue-600'
						>
							<Edit className='w-4 h-4' />
						</button>
						<button onClick={() => onDelete("goal", goal.id)} className='text-gray-400 hover:text-red-600'>
							<Trash2 className='w-4 h-4' />
						</button>
					</div>
				</div>
			))}
		</div>
	</div>
);
