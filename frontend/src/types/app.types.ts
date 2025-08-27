import type { ApiExpense, ApiGoal, ApiIncome } from "./api.types";

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
	id: string;
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
	raw: { incomes: ApiIncome[]; expenses: ApiExpense[]; goals: ApiGoal[] };
}

export type ViewState = { type: "overview" } | { type: "month"; year: string; month: string } | { type: "goals" };
