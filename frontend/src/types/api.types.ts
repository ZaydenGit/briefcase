export interface ApiUser {
	_id: string;
	username: string;
	email: string;
}

export interface ApiIncome {
	_id: string;
	userId: string;
	name: string;
	amount: number;
	date: string;
}

export interface ApiExpense {
	_id: string;
	userId: string;
	name: string;
	amount: number;
	date: string;
	isRecurring: boolean;
}

export interface ApiGoal {
	_id: string;
	userId: string;
	name: string;
	targetAmount: number;
	currentAmount: number;
	monthlyPayment: number | null;
}
