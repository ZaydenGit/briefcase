import { useState, type FC } from "react";
import type { ApiUser } from "../types/api.types";
import { Briefcase, LayoutDashboard, LoaderCircle, Target, TrendingUp } from "lucide-react";

interface LandingPageProps {
	navigate: (path: string) => void;
	user: ApiUser | null;
	onLogout: () => void;
}

const words: string[] = ["Simply", "Quickly", "Easily", "Effectively", "Sweat Free"];

export const LandingPage: FC<LandingPageProps> = ({ navigate, user, onLogout }) => {
	const [loading, setLoading] = useState(false);

	return (
		<div className='bg-slate-100 text-gray-800 font-sans'>
			<header className='bg-gray-50 px-10 border-b border-gray-200 py-2 mb-20'>
				<div className='py-4 flex justify-between items-center'>
					<div className='flex items-center'>
						<Briefcase className='w-8 h-8 text-blue-600 hover:scale-115 hover:text-bold hover:text-blue-800 hover:rotate-6 transition-all ease-in-out duration-75' />
						<span className='text-2xl font-bold ml-2'>Briefcase</span>
					</div>
					<nav className='hidden md:flex items-center absolute left-1/2 -translate-x-1/2 space-x-8'>
						<a href='#features' className='hover:text-blue-600'>
							Features
						</a>
						<a href='https://github.com/ZaydenGit/briefcase/' className='hover:text-blue-600'>
							About
						</a>
						<a href='https://www.linkedin.com/in/zayden-middleton/' className='hover:text-blue-600'>
							Contact
						</a>
					</nav>
					<div>
						{user ? (
							<div className='flex items-center'>
								<p className='pr-4 text-sm text-gray-600'>Hello, {user.username}.</p>
								<button
									onClick={async () => {
										await setLoading(false);
										await onLogout();
										await setLoading(true);
									}}
									disabled={loading}
									className='bg-blue-600 text-center text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-300'
								>
									{loading ? <LoaderCircle className='animate-spin' /> : "Logout"}
								</button>
							</div>
						) : (
							<button
								onClick={() => navigate("/login")}
								className='bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors'
							>
								Login
							</button>
						)}
					</div>
				</div>
			</header>

			<main>
				<section className='text-center'>
					<div className='py-10 md:py-18'>
						<h1 className='text-4xl md:text-6xl font-extrabold leading-tight'>
							Master Your Money,{" "}
							<span className='text-blue-800 underline'>{words[Math.floor(Math.random() * words.length)]}.</span>
						</h1>
						<p className='mt-4 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto'>
							Briefcase is the clean, minimal, and powerful way to track your finances, set goals, and build a brighter
							financial future.
						</p>
						<div>
							{user ? (
								<button
									onClick={() => navigate("/dashboard")}
									className='mt-8 bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-transform transform hover:scale-105'
								>
									Go to Dashboard
								</button>
							) : (
								<button
									onClick={() => navigate("/login")}
									className='mt-8 bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-transform transform hover:scale-105'
								>
									Get Started Now!
								</button>
							)}
						</div>
					</div>
				</section>
				<section id='features' className='mt-10 md:mt-18 py-10 bg-gray-50 border-t border-gray-200'>
					<div className='container mx-auto px-6 text-center'>
						<h2 className='text-3xl md:text-4xl font-bold mb-4'>Everything you need, nothing you don't.</h2>
						<p className='text-gray-600 mb-12 max-w-2xl mx-auto'>
							Focus on what matters with a streamlined set of powerful features.
						</p>
						<div className='grid grid-cols-1 md:grid-cols-3 gap-12'>
							<div className='flex flex-col items-center'>
								<div className='bg-blue-100 text-blue-600 rounded-full p-4 mb-4'>
									<LayoutDashboard className='w-8 h-8' />
								</div>
								<h3 className='text-xl font-semibold mb-2'>Intuitive Dashboard</h3>
								<p className='text-gray-600'>
									See your entire financial picture at a glance. Track income, expenses, and net savings with beautiful,
									easy-to-read charts.
								</p>
							</div>
							<div className='flex flex-col items-center'>
								<div className='bg-green-100 text-green-600 rounded-full p-4 mb-4'>
									<Target className='w-8 h-8' />
								</div>
								<h3 className='text-xl font-semibold mb-2'>Goal Tracking</h3>
								<p className='text-gray-600'>
									Set financial goals and watch your progress. Whether it's a new car or a down payment, we'll help you
									get there.
								</p>
							</div>
							<div className='flex flex-col items-center'>
								<div className='bg-red-100 text-red-600 rounded-full p-4 mb-4'>
									<TrendingUp className='w-8 h-8' />
								</div>
								<h3 className='text-xl font-semibold mb-2'>Expense Management</h3>
								<p className='text-gray-600'>
									Easily categorize one-time and recurring expenses to understand where your money is going each month.
								</p>
							</div>
						</div>
					</div>
				</section>
			</main>

			<footer className='bg-gray-800 text-white py-8'>
				<div className='container mx-auto px-6 text-center'>
					<p>&copy; {new Date().getFullYear()} Briefcase. All Rights Reserved.</p>
				</div>
			</footer>
		</div>
	);
};
