import type { ApiExpense, ApiGoal, ApiIncome } from "../types/api.types";
import type {
	AppData,
	FormattedGoal,
	MonthTransaction,
	OverviewData,
	UpcomingExpense,
	Years,
} from "../types/app.types";

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

	console.log("Overview:", overview);
	console.log("Goals:", formattedGoals);
	console.log("Years:", years);

	return { overview, goals: formattedGoals, years };
};
