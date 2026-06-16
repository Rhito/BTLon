<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Base\BaseController;
use App\Http\Requests\LoginRequest;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends BaseController
{
    public function login(LoginRequest $request)
    {
        $credentials = $request->validated();

        if (!Auth::attempt($credentials)) {
            return $this->error('credentials do not match.', [], 401);
        }

        $user = Auth::user();
        if (!$user->isAdmin()) {
            Auth::logout();
            return $this->error('You are not authorized.', [], 403);
        }

        $user->tokens()->delete();
        $token = $user->createToken('auth_token', ['*'], now()->addHours(8))->plainTextToken;

        return $this->success('login successfully.', [
            'user' => new UserResource($user),
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return $this->error('user not found', null, 404);
        }
        $user->currentAccessToken()->delete();
        return $this->success('logout successfully.');
    }

    public function checkToken(Request $request)
    {
        return response()->json([
            'valid' => true,
            'user' => new UserResource($request->user()),
        ]);
    }
}
