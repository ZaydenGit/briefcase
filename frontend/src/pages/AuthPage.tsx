import { useState, type FC, type FormEvent } from "react";
<<<<<<< Updated upstream
import type { ApiUser } from "../utils/formatApiData";
import { apiRequest } from "../network/apiRequest";
import { Briefcase, LoaderCircle } from "lucide-react";
=======
import { apiRequest } from "../network/apiRequest";
import { Briefcase, LoaderCircle } from "lucide-react";
import type { ApiUser } from "../types/api.types";
>>>>>>> Stashed changes

interface AuthPageProps {
	onAuthSuccess: (user: ApiUser) => void;
}

export const AuthPage: FC<AuthPageProps> = ({ onAuthSuccess }) => {
	const [isLoginView, setIsLoginView] = useState(false);
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		try {
			const endpoint = isLoginView ? "/users/login" : "/users/register";
			const body = isLoginView ? { email, password } : { username, email, password };
			console.log(body);
			const user = await apiRequest<ApiUser>(endpoint, "POST", body);
<<<<<<< Updated upstream

			onAuthSuccess(user);
=======
			const authUser = await apiRequest<ApiUser>("/users/", "GET", user);
			console.log(authUser);
			onAuthSuccess(authUser);
>>>>>>> Stashed changes
		} catch (err: any) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='flex items-center justify-center min-h-screen bg-gray-100'>
			<div className='w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg'>
				<div className='text-center'>
					<Briefcase className='mx-auto h-12 w-auto text-blue-600' />
					<h2 className='mt-6 text-3xl font-extrabold text-gray-900'>
						{isLoginView ? "Sign in to Briefcase" : "Create your account"}
					</h2>
				</div>
				<form className='space-y-6' onSubmit={handleSubmit}>
					{!isLoginView && (
						<div>
							<label htmlFor='username' className='block text-sm font-medium text-gray-600'>
								Username
							</label>
							<input
								id='username'
								name='username'
								type='text'
								autoComplete='username'
								required
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								className='mt-1 block w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:outerline-none focus:ring-blue-500 focus:bordr-blue-500'
							/>
						</div>
					)}
					<div>
						<label htmlFor='email' className='block text-sm font-medium text-gray-700'>
							Email
						</label>
						<input
							id='email'
							name='email'
							type='email'
							autoComplete='email'
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className='mt-1 block w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:outerline-none focus:ring-blue-500 focus:bordr-blue-500'
						/>
					</div>
					<div>
						<label htmlFor='username' className='block text-sm font-medium text-gray-700'>
							Password
						</label>
						<input
							id='Password'
							name='Password'
							type='password'
							autoComplete='current-password'
							required
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className='mt-1 block w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:outerline-none focus:ring-blue-500 focus:bordr-blue-500'
						/>
					</div>
					{error && (
						<p className='text-sm text-red-600'>{`Error ${isLoginView ? "logging in" : "signing up"}: ${error}`}</p>
					)}
					<div>
						<button
							type='submit'
							disabled={loading}
							className='flex w-full justify-center py-2 px-4 rounded-md bordere border-transparent text-sm font-medium text-white bg-blue-600 shadow-sm placeholder-gray-400 focus:bg-blue-700 focus:outline-none focus:ring-blue-500 disabled:bg-blue-300 '
						>
							{loading ? <LoaderCircle className='animate-spin' /> : isLoginView ? "Sign in" : "Create account"}
						</button>
					</div>
				</form>
				<p className='text-sm text-center text-gray-600'>
					{isLoginView ? "Don't have an account? " : "Already have an account? "}
					<button
						onClickCapture={() => {
							setIsLoginView(!isLoginView);
							setError(null);
						}}
						className='font-medium text-blue-500 hover:text-blue-300'
					>
						{isLoginView ? "Sign up" : "Sign in"}
					</button>
				</p>
			</div>
		</div>
	);
};
