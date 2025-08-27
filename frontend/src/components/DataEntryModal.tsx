import { useEffect, useState, type FC, type FormEvent } from "react";
import type { ModalState } from "../types/modal.types";
import { formatInputDate } from "../utils/formatInputDate";
import { apiRequest } from "../network/apiRequest";
import { LoaderCircle, X } from "lucide-react";

interface DataEntryModalProps {
	modalState: ModalState;
	onClose: () => void;
	onSave: () => void;
}
export const DataEntryModal: FC<DataEntryModalProps> = ({ modalState, onClose, onSave }) => {
	const [formData, setFormData] = useState<any>({});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (modalState) {
			setError(null);
			const { data } = modalState;
			console.log("Data:", data);
			const defaults = {
				name: "",
				amount: "",
				date: formatInputDate(new Date()),
				isRecurring: false,
				targetAmount: "",
				currentAmount: "",
				monthlyContribution: "",
			};
			const initialData = data
				? {
						...defaults,
						...data,
						date: data.date ? formatInputDate(new Date(data.date)) : formatInputDate(new Date()),
				  }
				: defaults;
			setFormData(initialData);
		}
	}, [modalState]);

	if (!modalState) return null;

	const { mode, type, data } = modalState;

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value, type } = e.target;
		const isCheckbox = type === "checkbox";
		setFormData((prev: any) => ({ ...prev, [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value }));
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		try {
			let endpoint = "";
			let body: any = {};
			let method: "POST" | "PATCH" = mode === "add" ? "POST" : "PATCH";

			switch (type) {
				case "income":
					endpoint = mode === "add" ? "/incomes" : `/incomes/${data._id}`;
					body = { name: formData.name, amount: parseFloat(formData.amount), date: formData.date };
					break;
				case "expense":
					endpoint = mode === "add" ? "/expenses" : `/expenses/${data._id}`;
					body = {
						name: formData.name,
						amount: parseFloat(formData.amount),
						date: formData.date,
						isRecurring: formData.isRecurring,
					};
					break;
				case "goal":
					endpoint = mode === "add" ? "/goals" : `/goals/${data.id}`;
					body = {
						name: formData.name,
						targetAmount: parseFloat(formData.targetAmount),
						currentAmount: mode === "add" ? 0 : data.current,
						monthlyContribution: parseFloat(formData.monthlyContribution) || null,
					};
					break;
				case "contribution":
					method = "PATCH";
					endpoint = `/goals/${data.id}`;
					body = { currentAmount: data.current + parseFloat(formData.amount) };
					break;
			}
			await apiRequest(endpoint, method, body);
			onSave();
			onClose();
		} catch (err: any) {
			setError(err.message || "An unexpected error occurred.");
		} finally {
			setLoading(false);
		}
	};

	const title = `${mode === "add" ? "Add" : "Edit"} ${type.charAt(0).toUpperCase() + type.slice(1)}`;

	return (
		<div className='fixed inset-0 backdrop-blur-sm backdrop-brightness-90 flex justify-center items-center z-50'>
			<div className='bg-white rounded-lg shadow-xl p-6 w-full max-w-md'>
				<div className='flex justify-between items-center mb-4'>
					<h3 className='text-xl font-semibold text-gray-800'>{title}</h3>
					<button onClick={onClose} className='text-gray-400 hover:text-gray-600'>
						<X className='w-6 h-6' />
					</button>
				</div>
				<form onSubmit={handleSubmit} className='space-y-4'>
					{type !== "contribution" && (
						<div>
							<label className='block text-sm font-medium text-gray-700'>Name</label>
							<input
								type='text'
								name='name'
								value={formData.name || ""}
								onChange={handleChange}
								required
								className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md'
							/>
						</div>
					)}
					{type === "goal" && (
						<>
							<div>
								<label className='block text-sm font-medium text-gray-700'>Target Amount</label>
								<input
									type='number'
									name='targetAmount'
									value={formData.targetAmount || ""}
									onChange={handleChange}
									required
									className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md'
								/>
							</div>
							<div>
								<label className='block text-sm font-medium text-gray-700'>Monthly Contribution (Optional)</label>
								<input
									type='number'
									name='monthlyContribution'
									value={formData.monthlyContribution || ""}
									onChange={handleChange}
									className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md'
								/>
							</div>
						</>
					)}
					{(type === "income" || type === "expense" || type === "contribution") && (
						<div>
							<label className='block text-sm font-medium text-gray-700'>Amount</label>
							<input
								type='number'
								name='amount'
								value={formData.amount || ""}
								onChange={handleChange}
								required
								className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md'
							/>
						</div>
					)}
					{(type === "income" || type === "expense") && (
						<div>
							<label className='block text-sm font-medium text-gray-700'>Date</label>
							<input
								type='date'
								name='date'
								value={formData.date || ""}
								onChange={handleChange}
								required
								className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md'
							/>
						</div>
					)}
					{error && <p className='text-sm text-red-600'>{error}</p>}
					<div className='flex justify-end space-x-3 pt-4'>
						<button
							type='button'
							onClick={onClose}
							className='px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200'
						>
							Cancel
						</button>
						<button
							type='submit'
							disabled={loading}
							className='px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300'
						>
							{loading ? <LoaderCircle className='animate-spin' /> : "Save"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};
