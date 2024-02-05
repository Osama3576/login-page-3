'use client';
import axios from 'axios';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
function AuthForm() {
  const [variant, setVariant] = useState('Login');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if (session?.status === 'authenticated') {
      router.push('/webpage');
    }
  }, [session?.status, router]);

  const changeVariant = useCallback(() => {
    variant === 'Login'
      ? setVariant('Register')
      : setVariant('Login');
  }, [variant, setVariant]);

  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = data => {
    setIsLoading(true);
    if (variant === 'Register') {
      axios
        .post('/api/register', data)
        .then(() => signIn('credentials', data))
        .catch(() => toast.error('Please fill the form carefully'))
        .finally(() => {
          setIsLoading(false);
          if (data) toast.success('successfully registered');
        });
    }
    if (variant === 'Login') {
      signIn('credentials', {
        ...data,
        redirect: false,
      })
        .then(callback => {
          if (callback?.error) toast.error('invalid Credentials');
          if (callback?.ok && !callback?.error)
            toast.success('Sucessfully logged in');
          router.push('/webpage');
        })
        .finally(() => setIsLoading(false));
    }
  };
  return (
    <div className="p-4 text-white ">
      <div className="flex flex-col items-center mb-8">
        <h1 className="mb-2 text-2xl font-bold max-w-[10rem] text-center">
          {variant === 'Login' ? 'Login' : 'Create new Account'}
        </h1>
        <div className="text-sm">
          {variant === 'Login' ? (
            'Sign in to continue.'
          ) : (
            <p>
              Already Registered?
              <a
                className="cursor-pointer hover:text-indigo-300"
                onClick={changeVariant}
              >
                &nbsp;Log in here.
              </a>
            </p>
          )}
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        {variant === 'Register' && (
          <div>
            <Label htmlFor="name">NAME</Label>
            <Input
              disabled={isLoading}
              id="name"
              {...register('name', { required: true })}
              className="mt-4 bg-slate-400 focus-visible:ring-indigo-700"
              type="text"
              placeholder="Name"
            />
            {errors.name && (
              <span className="text-xs text-rose-300">
                This field is required
              </span>
            )}
          </div>
        )}

        <div>
          <Label htmlFor="email">EMAIL</Label>
          <Input
            disabled={isLoading}
            id="email"
            {...register('email', { required: true })}
            className="mt-4 bg-slate-400 focus-visible:ring-indigo-700"
            type="email"
            placeholder="Email"
          />
          {errors.email && (
            <span className="text-xs text-rose-300">
              This field is required
            </span>
          )}
        </div>
        <div>
          <Label htmlFor="password">PASSWORD</Label>
          <Input
            disabled={isLoading}
            id="password"
            {...register('password', { required: true })}
            className="mt-4 bg-slate-400 focus-visible:ring-indigo-700"
            type="password"
            placeholder="Password"
          />
          {errors.password && (
            <span className="text-xs text-rose-300">
              This field is required
            </span>
          )}
        </div>
        <Button
          disabled={isLoading}
          type="submit"
          className="w-full transition bg-indigo-600 hover:bg-indigo-500"
        >
          {variant === 'Login' ? 'Sign in' : 'Sign up'}
        </Button>
      </form>

      {variant === 'Login' && (
        <div className="mt-4">
          <p>
            Dont have an Account?{' '}
            <a
              className="cursor-pointer hover:text-indigo-300"
              onClick={changeVariant}
            >
              click here
            </a>
          </p>
        </div>
      )}
    </div>
  );
}

export default AuthForm;
