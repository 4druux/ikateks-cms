<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $isFirstUser = User::count() === 0;

        if ($isFirstUser) {
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => ['required', 'confirmed', Password::defaults()],
            ]);
        } else {
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => ['required', 'confirmed', Password::defaults()],
            ]);
        }
    
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $isFirstUser ? 'superadmin' : 'admin',
            'approved_at' => $isFirstUser ? now() : null, 
        ]);

        $message = $isFirstUser
            ? 'Super Admin registration successful! Please log in.'
            : 'Registration successful! Your account is pending Super Admin approval.';

        return response()->json(['message' => $message], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string',
            'password' => 'required|string',
        ]);

        $loginInput = $request->input('email');
        $password = $request->input('password');
        $loginField = filter_var($loginInput, FILTER_VALIDATE_EMAIL) ? 'email' : 'no_peserta';

        $credentials = [
            $loginField => $loginInput,
            'password' => $password
        ];

        if (!Auth::attempt($credentials)) {
            throw ValidationException::withMessages([
                'email' => __('Incorrect email or password.'),
            ]);
        }

        $user = Auth::user();
        if (is_null($user->approved_at) && $user->role !== 'superadmin') { 
            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            throw ValidationException::withMessages([
                'login' => 'Your account is pending Super Admin approval.',
            ]);
        }

        $request->session()->regenerate();

        return response()->json([
            'message' => 'Login successful!',
            'user' => $user
        ]);
    }

    public function logout(Request $request)
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->noContent();
    }
}