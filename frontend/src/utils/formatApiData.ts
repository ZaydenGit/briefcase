export interface ApiUser {
	_id: string;
	username: string;
	email: string;
}

export interface ApiIncome {
	_id: string;
	name: string;
	amount: number;
	date: string;
}

export interface ApiExpense {
	_id: string;
	name: string;
	amount: number;
	date: string;
	isRecurring: boolean;
}

export interface ApiGoal {
	_id: string;
	name: string;
	targetAmount: number;
	currentAmount: number;
	monthlyPayment: number | null;
}

export interface OverviewData {
	totalSavings: number;
	monthlyIncome: number;
	monthlyExpenses: number;
	netSavings: number;
	upcomingExpenses: UpcomingExpense[];
}

export interface FormattedGoal {
	id: string;
	name: string;
	current: number;
	target: number;
	contribution: number | null;
}
export interface MonthTransaction {
	name: string;
	amount: number;
}

export interface MonthData {
	income: number;
	expenses: number;
	net: number;
	recurring: MonthTransaction[];
	oneTime: MonthTransaction[];
}

export interface YearData {
	[month: string]: MonthData;
}

export interface Years {
	[year: string]: YearData;
}

export interface UpcomingExpense {
	name: string;
	amount: number;
	due: string;
}

export interface AppData {
	overview: OverviewData; // overview page will have savings, income, expenses, net savings, upcoming expenses (goals, monthly subs)
	goals: FormattedGoal[];
	years: Years;
}

export const formatApiData = (incomes: ApiIncome[], expenses: ApiExpense[], goals: ApiGoal[]): AppData => {
	const years: Years = {};
	const monthNames = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

	//income
	incomes.forEach((income) => {
		const date = new Date(income.date);
		const year = date.getFullYear().toString();
		const month = monthNames[date.getMonth()];
		if (!years[year]) years[year] = {};
		if (!years[year][month]) years[year][month] = { income: 0, expenses: 0, net: 0, recurring: [], oneTime: [] };
		years[year][month].income += income.amount;
	});

	//expenses
	expenses.forEach((expense) => {
		const date = new Date(expense.date);
		const year = date.getFullYear().toString();
		const month = monthNames[date.getMonth()];
		if (!years[year]) years[year] = {};
		if (!years[year][month]) years[year][month] = { income: 0, expenses: 0, net: 0, recurring: [], oneTime: [] };
		years[year][month].expenses += expense.amount;
		const transaction: MonthTransaction = { name: expense.name, amount: expense.amount };
		if (expense.isRecurring) years[year][month].recurring.push(transaction);
		else years[year][month].oneTime.push(transaction);
	});

	const totalIncome = incomes.reduce((acc, curr) => acc + curr.amount, 0);
	const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
	const totalSavings = totalIncome - totalExpenses;

	//net savings
	Object.values(years).forEach((yearData) => {
		Object.values(yearData).forEach((monthData) => {
			monthData.net = monthData.income - monthData.expenses;
		});
	});

	const now = new Date();
	const currentYear = now.getFullYear().toString();
	const currentMonthName = monthNames[now.getMonth()];
	const currentMonthData = years[currentYear]?.[currentMonthName] || { income: 0, expenses: 0, net: 0 };

	const upcomingExpenses: UpcomingExpense[] = expenses
		.filter((e) => e.isRecurring && new Date(e.date) > now)
		.slice(0, 3)
		.map((e) => ({ name: e.name, amount: e.amount, due: new Date(e.date).toLocaleDateString() }));

	const overview: OverviewData = {
		totalSavings,
		monthlyIncome: currentMonthData.income,
		monthlyExpenses: currentMonthData.expenses,
		netSavings: currentMonthData.net,
		upcomingExpenses,
	};

	const formattedGoals: FormattedGoal[] = goals.map((g) => ({
		id: g._id,
		name: g.name,
		current: g.currentAmount,
		target: g.targetAmount,
		contribution: g.monthlyPayment,
	}));

	return { overview, goals: formattedGoals, years };
};
