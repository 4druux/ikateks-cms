<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;

class AccountSettingsController extends Controller
{
    public function updateApi(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        try {
            $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'current_password' => ['nullable', 'required_with:password', 'string'],
                'password' => ['nullable', 'required_with:current_password', 'confirmed', Password::defaults()],
            ], [
                'name.required' => 'The name field is required.',
                'current_password.required_with' => 'The current password is required when changing the password.',
                'password.required_with' => 'The new password is required when changing the password.',
                'password.confirmed' => 'The new password confirmation does not match.',
            ]);

            $updateData = ['name' => $request->name];

            if ($request->filled('password') && $request->filled('current_password')) {
                if (!Hash::check($request->current_password, $user->password)) {
                    throw ValidationException::withMessages([
                                'current_password' => ['The current password you entered is incorrect.'],
            
                    ]);
                }
                $updateData['password'] = Hash::make($request->password);
            }

            $user->update($updateData);

            return response()->json([
                'message' => 'Account settings updated successfully.',
                'user' => $user->fresh(),
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error("Failed to update Account Settings: " . $e->getMessage());

            return response()->json([
                'message' => 'An internal error occurred while updating the account.'
    
            ], 500);
        }
    }
}