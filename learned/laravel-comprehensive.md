# Laravel — Comprehensive Reference Guide

> **Version focus**: Laravel 10.x / 11.x  
> **Last updated**: May 2026  
> **Purpose**: Complete reference for every major Laravel subsystem with code examples, best practices, and internal mechanics.

---

## Table of Contents

1. [Installation & Configuration](#1-installation--configuration)
2. [Architecture & Lifecycle](#2-architecture--lifecycle)
3. [Service Container & Dependency Injection](#3-service-container--dependency-injection)
4. [Service Providers](#4-service-providers)
5. [Facades](#5-facades)
6. [Routing](#6-routing)
7. [Middleware](#7-middleware)
8. [Controllers](#8-controllers)
9. [Request & Response](#9-request--response)
10. [Validation](#10-validation)
11. [Blade Templating](#11-blade-templating)
12. [Database — Migrations](#12-database--migrations)
13. [Database — Query Builder](#13-database--query-builder)
14. [Eloquent ORM](#14-eloquent-orm)
15. [Eloquent Relationships](#15-eloquent-relationships)
16. [Eloquent Collections](#16-eloquent-collections)
17. [Authentication](#17-authentication)
18. [Authorization (Gates & Policies)](#18-authorization-gates--policies)
19. [Artisan Console](#19-artisan-console)
20. [Events & Listeners](#20-events--listeners)
21. [Queues & Jobs](#21-queues--jobs)
22. [Task Scheduling](#22-task-scheduling)
23. [Mail](#23-mail)
24. [Notifications](#24-notifications)
25. [File Storage](#25-file-storage)
26. [Caching](#26-caching)
27. [Session](#27-session)
28. [Logging](#28-logging)
29. [Error Handling & Exceptions](#29-error-handling--exceptions)
30. [Testing](#30-testing)
31. [API Resources](#31-api-resources)
32. [Localization (i18n)](#32-localization-i18n)
33. [Broadcasting (WebSockets)](#33-broadcasting-websockets)
34. [Rate Limiting](#34-rate-limiting)
35. [Helpers & Collections](#35-helpers--collections)
36. [Package Development](#36-package-development)
37. [Deployment & Optimization](#37-deployment--optimization)

---

## 1. Installation & Configuration

### 1.1 System Requirements

| Requirement      | Minimum Version |
|------------------|-----------------|
| PHP              | 8.1+ (Laravel 10), 8.2+ (Laravel 11) |
| Composer         | 2.x             |
| Database         | MySQL 5.7+ / PostgreSQL 10+ / SQLite 3.35+ / SQL Server 2017+ |
| Node.js (assets) | 16+             |

### 1.2 Installation Methods

```bash
# Via Composer (recommended)
composer create-project laravel/laravel my-app

# Via Laravel Installer
composer global require laravel/installer
laravel new my-app

# With specific version
composer create-project laravel/laravel:^10.0 my-app

# With starter kit
laravel new my-app --breeze    # Breeze (simple auth)
laravel new my-app --jet       # Jetstream (advanced)
```

### 1.3 Directory Structure

```
my-app/
├── app/
│   ├── Console/           # Artisan commands
│   ├── Exceptions/        # Exception handlers
│   ├── Http/
│   │   ├── Controllers/   # Request handlers
│   │   ├── Middleware/     # HTTP middleware
│   │   └── Requests/      # Form request validation
│   ├── Models/            # Eloquent models
│   ├── Providers/         # Service providers
│   ├── Services/          # Business logic (custom)
│   ├── Repositories/      # Data access (custom)
│   ├── Events/            # Event classes
│   ├── Listeners/         # Event listeners
│   ├── Jobs/              # Queueable jobs
│   ├── Mail/              # Mailable classes
│   ├── Notifications/     # Notification classes
│   ├── Policies/          # Authorization policies
│   └── Rules/             # Custom validation rules
├── bootstrap/
│   ├── app.php            # Application bootstrap
│   └── cache/             # Framework cache files
├── config/                # All configuration files
│   ├── app.php
│   ├── auth.php
│   ├── cache.php
│   ├── database.php
│   ├── filesystems.php
│   ├── logging.php
│   ├── mail.php
│   ├── queue.php
│   └── session.php
├── database/
│   ├── factories/         # Model factories
│   ├── migrations/        # Database migrations
│   └── seeders/           # Database seeders
├── public/                # Web server document root
│   └── index.php          # Entry point
├── resources/
│   ├── css/               # Stylesheets
│   ├── js/                # JavaScript
│   ├── lang/              # Language files
│   └── views/             # Blade templates
├── routes/
│   ├── api.php            # API routes
│   ├── channels.php       # Broadcast channels
│   ├── console.php        # Console routes
│   └── web.php            # Web routes
├── storage/
│   ├── app/               # Application files
│   ├── framework/         # Sessions, cache, views
│   └── logs/              # Log files
├── tests/
│   ├── Feature/           # Feature tests
│   └── Unit/              # Unit tests
├── .env                   # Environment variables
├── artisan                # CLI entry point
├── composer.json          # PHP dependencies
├── package.json           # Node dependencies
├── phpunit.xml            # Test configuration
└── vite.config.js         # Vite bundler config
```

### 1.4 Environment Configuration

```env
# .env — never commit this file

APP_NAME=MyApp
APP_ENV=local              # local | staging | production
APP_KEY=base64:...         # php artisan key:generate
APP_DEBUG=true
APP_URL=http://localhost:8000

# Logging
LOG_CHANNEL=stack
LOG_LEVEL=debug

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=myapp
DB_USERNAME=root
DB_PASSWORD=secret

# Cache / Queue / Session drivers
CACHE_DRIVER=redis
QUEUE_CONNECTION=redis
SESSION_DRIVER=redis

# Redis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

# Mail
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="${APP_NAME}"
```

```php
// Accessing environment variables in code
$value = env('APP_DEBUG', false);          // Direct (only in config files)
$value = config('app.debug');              // Via config (preferred everywhere)

// In config files:
// config/app.php
return [
    'name'  => env('APP_NAME', 'Laravel'),
    'env'   => env('APP_ENV', 'production'),
    'debug' => (bool) env('APP_DEBUG', false),
    'url'   => env('APP_URL', 'http://localhost'),
];
```

> ⚠️ **Important**: Never call `env()` outside of config files. After `php artisan config:cache`, `env()` returns `null`. Always use `config()` instead.

### 1.5 Configuration Caching

```bash
# Cache all config for production
php artisan config:cache

# Clear config cache
php artisan config:clear

# Cache routes
php artisan route:cache

# Cache views
php artisan view:cache

# Single optimize command (config + route + view + events)
php artisan optimize

# Clear all caches
php artisan optimize:clear
```

---

## 2. Architecture & Lifecycle

### 2.1 Request Lifecycle

```
Client Request
    │
    ▼
public/index.php
    │
    ▼
bootstrap/app.php ─── Creates Application (Service Container)
    │
    ▼
HTTP Kernel
    ├── Global Middleware Stack
    │       │
    │       ▼
    ├── Route Matching (Router)
    │       │
    │       ▼
    ├── Route Middleware
    │       │
    │       ▼
    ├── Controller / Closure
    │       │
    │       ▼
    ├── Response Object
    │       │
    │       ▼
    └── Global Middleware (reverse) ─── terminate()
            │
            ▼
      Send Response to Client
```

### 2.2 Key Architectural Concepts

| Concept | Description |
|---------|-------------|
| **Service Container** | IoC container — resolves classes and their dependencies |
| **Service Provider** | Central place to register bindings, event listeners, middleware, routes |
| **Facade** | Static-like interface to services resolved from the container |
| **Contract** | Interface defining a framework service (decoupling) |
| **Middleware** | Filters HTTP requests entering the application |

### 2.3 Laravel 11 Streamlined Structure

Laravel 11 introduced a slimmer application skeleton:

```php
// bootstrap/app.php (Laravel 11)
return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            // Custom web middleware
        ]);
        $middleware->api(prepend: [
            // Custom API middleware
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->dontReport([
            // Exceptions to not report
        ]);
    })
    ->create();
```

---

## 3. Service Container & Dependency Injection

### 3.1 Basic Binding

```php
use App\Services\PaymentGateway;
use App\Contracts\PaymentGatewayInterface;

// Simple binding (new instance each time)
$this->app->bind(PaymentGatewayInterface::class, function ($app) {
    return new PaymentGateway(config('services.stripe.key'));
});

// Singleton binding (same instance always)
$this->app->singleton(PaymentGatewayInterface::class, function ($app) {
    return new PaymentGateway(config('services.stripe.key'));
});

// Scoped binding (same instance within a single request/job)
$this->app->scoped(PaymentGatewayInterface::class, function ($app) {
    return new PaymentGateway(config('services.stripe.key'));
});

// Instance binding (bind an already existing object)
$gateway = new PaymentGateway('sk_test_...');
$this->app->instance(PaymentGatewayInterface::class, $gateway);
```

### 3.2 Resolving from Container

```php
// Via type-hinting (automatic injection) — preferred
class OrderController extends Controller {
    public function __construct(
        private PaymentGatewayInterface $gateway
    ) {}
}

// Via app() helper
$gateway = app(PaymentGatewayInterface::class);

// Via make()
$gateway = app()->make(PaymentGatewayInterface::class);

// With parameters
$gateway = app()->makeWith(PaymentGateway::class, ['apiKey' => 'sk_...']);
```

### 3.3 Contextual Binding

```php
// Different implementations for different consumers
$this->app->when(OrderController::class)
    ->needs(PaymentGatewayInterface::class)
    ->give(StripeGateway::class);

$this->app->when(SubscriptionController::class)
    ->needs(PaymentGatewayInterface::class)
    ->give(PayPalGateway::class);

// Binding primitives
$this->app->when(ReportService::class)
    ->needs('$reportPath')
    ->give(storage_path('reports'));
```

### 3.4 Tagging

```php
// Group multiple bindings under a tag
$this->app->bind(CpuReport::class);
$this->app->bind(MemoryReport::class);
$this->app->tag([CpuReport::class, MemoryReport::class], 'reports');

// Resolve all tagged services
$reports = app()->tagged('reports');
foreach ($reports as $report) {
    $report->generate();
}
```

### 3.5 Container Events

```php
// Fire callback every time a type is resolved
$this->app->resolving(PaymentGatewayInterface::class, function ($gateway, $app) {
    $gateway->setLogger($app->make(Logger::class));
});

// Fire for ANY resolution
$this->app->resolving(function ($object, $app) {
    // Called every time any object is resolved
});
```

---

## 4. Service Providers

### 4.1 Creating a Provider

```bash
php artisan make:provider PaymentServiceProvider
```

```php
// app/Providers/PaymentServiceProvider.php
namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\PaymentGateway;
use App\Contracts\PaymentGatewayInterface;

class PaymentServiceProvider extends ServiceProvider
{
    /**
     * Register bindings in the container.
     * Only bind things — don't use other services here.
     */
    public function register(): void
    {
        $this->app->singleton(PaymentGatewayInterface::class, function ($app) {
            return new PaymentGateway(
                config('services.stripe.key'),
                config('services.stripe.secret')
            );
        });

        // Merge package config
        $this->mergeConfigFrom(__DIR__.'/../../config/payment.php', 'payment');
    }

    /**
     * Bootstrap any application services.
     * All providers are registered — now you can use other services.
     */
    public function boot(): void
    {
        // Publish config
        $this->publishes([
            __DIR__.'/../../config/payment.php' => config_path('payment.php'),
        ], 'payment-config');

        // Publish migrations
        $this->publishesMigrations([
            __DIR__.'/../../database/migrations' => database_path('migrations'),
        ], 'payment-migrations');

        // Load routes
        $this->loadRoutesFrom(__DIR__.'/../../routes/payment.php');

        // Load views
        $this->loadViewsFrom(__DIR__.'/../../resources/views', 'payment');

        // Load translations
        $this->loadTranslationsFrom(__DIR__.'/../../lang', 'payment');
    }
}
```

### 4.2 Registering Providers

```php
// config/app.php (Laravel 10)
'providers' => [
    // Framework providers ...
    App\Providers\AppServiceProvider::class,
    App\Providers\AuthServiceProvider::class,
    App\Providers\EventServiceProvider::class,
    App\Providers\RouteServiceProvider::class,
    App\Providers\PaymentServiceProvider::class, // Custom
],

// Laravel 11 — bootstrap/providers.php
return [
    App\Providers\AppServiceProvider::class,
    App\Providers\PaymentServiceProvider::class,
];
```

### 4.3 Deferred Providers

```php
// Only loaded when one of the provided bindings is needed
class HeavyServiceProvider extends ServiceProvider implements DeferrableProvider
{
    public function register(): void
    {
        $this->app->singleton(HeavyService::class, function () {
            return new HeavyService(); // Only constructed when first resolved
        });
    }

    public function provides(): array
    {
        return [HeavyService::class];
    }
}
```

---

## 5. Facades

### 5.1 How Facades Work

```
Code: Cache::get('key')
         │
         ▼
    Cache Facade
    └── getFacadeAccessor() → returns 'cache'
                                    │
                                    ▼
                          Service Container resolves 'cache'
                                    │
                                    ▼
                          CacheManager instance
                          └── get('key')
```

### 5.2 Common Facades & Their Underlying Classes

| Facade | Class | Service Container Binding |
|--------|-------|--------------------------|
| `App` | `Illuminate\Foundation\Application` | `app` |
| `Auth` | `Illuminate\Auth\AuthManager` | `auth` |
| `Cache` | `Illuminate\Cache\CacheManager` | `cache` |
| `Config` | `Illuminate\Config\Repository` | `config` |
| `DB` | `Illuminate\Database\DatabaseManager` | `db` |
| `Event` | `Illuminate\Events\Dispatcher` | `events` |
| `File` | `Illuminate\Filesystem\Filesystem` | `files` |
| `Gate` | `Illuminate\Auth\Access\Gate` | `gate` (via `Illuminate\Contracts\Auth\Access\Gate`) |
| `Hash` | `Illuminate\Hashing\HashManager` | `hash` |
| `Http` | `Illuminate\Http\Client\Factory` | — |
| `Log` | `Illuminate\Log\LogManager` | `log` |
| `Mail` | `Illuminate\Mail\Mailer` | `mailer` |
| `Notification` | `Illuminate\Notifications\ChannelManager` | — |
| `Queue` | `Illuminate\Queue\QueueManager` | `queue` |
| `Redis` | `Illuminate\Redis\RedisManager` | `redis` |
| `Request` | `Illuminate\Http\Request` | `request` |
| `Response` | `Illuminate\Routing\ResponseFactory` | — |
| `Route` | `Illuminate\Routing\Router` | `router` |
| `Schema` | `Illuminate\Database\Schema\Builder` | — |
| `Session` | `Illuminate\Session\SessionManager` | `session` |
| `Storage` | `Illuminate\Filesystem\FilesystemManager` | `filesystem` |
| `URL` | `Illuminate\Routing\UrlGenerator` | `url` |
| `Validator` | `Illuminate\Validation\Factory` | `validator` |
| `View` | `Illuminate\View\Factory` | `view` |

### 5.3 Creating a Custom Facade

```php
// 1. Create the underlying service
namespace App\Services;

class Sms
{
    public function send(string $to, string $message): bool
    {
        // Send SMS logic
        return true;
    }
}

// 2. Register in a service provider
$this->app->singleton('sms', function () {
    return new \App\Services\Sms();
});

// 3. Create the Facade class
namespace App\Facades;

use Illuminate\Support\Facades\Facade;

class Sms extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return 'sms'; // matches the container binding key
    }
}

// 4. Use it
use App\Facades\Sms;
Sms::send('+1234567890', 'Hello!');
```

### 5.4 Real-Time Facades

```php
// Prefix any class namespace with "Facades\" to use it as a facade on-the-fly
use Facades\App\Services\Sms;

Sms::send('+1234567890', 'Hello!');
// Automatically resolves App\Services\Sms from the container
```

---

## 6. Routing

### 6.1 Basic Routes

```php
use Illuminate\Support\Facades\Route;

// Basic verbs
Route::get('/users', [UserController::class, 'index']);
Route::post('/users', [UserController::class, 'store']);
Route::put('/users/{id}', [UserController::class, 'update']);
Route::patch('/users/{id}', [UserController::class, 'update']);
Route::delete('/users/{id}', [UserController::class, 'destroy']);

// Multiple verbs
Route::match(['get', 'post'], '/form', [FormController::class, 'handle']);
Route::any('/webhook', [WebhookController::class, 'handle']);

// Closure route
Route::get('/hello', function () {
    return 'Hello World';
});

// Redirect route
Route::redirect('/old-path', '/new-path', 301);

// View route (no controller needed)
Route::view('/about', 'pages.about', ['year' => 2026]);
```

### 6.2 Route Parameters

```php
// Required parameter
Route::get('/users/{id}', function (string $id) {
    return "User $id";
});

// Optional parameter
Route::get('/users/{name?}', function (?string $name = 'Guest') {
    return "Hello $name";
});

// Multiple parameters
Route::get('/posts/{post}/comments/{comment}', function ($postId, $commentId) {
    // ...
});

// Regular expression constraints
Route::get('/users/{id}', fn($id) => "...")->where('id', '[0-9]+');
Route::get('/users/{name}', fn($name) => "...")->where('name', '[A-Za-z]+');
Route::get('/users/{id}/{name}', fn($id, $name) => "...")
    ->where(['id' => '[0-9]+', 'name' => '[a-z]+']);

// Shortcut constraints
Route::get('/users/{id}', fn($id) => "...")->whereNumber('id');
Route::get('/users/{name}', fn($name) => "...")->whereAlpha('name');
Route::get('/users/{slug}', fn($slug) => "...")->whereAlphaNumeric('slug');
Route::get('/users/{uuid}', fn($uuid) => "...")->whereUuid('uuid');
Route::get('/users/{ulid}', fn($ulid) => "...")->whereUlid('ulid');
Route::get('/items/{ids}', fn($ids) => "...")->whereIn('ids', ['photo', 'video']);

// Global constraints (in RouteServiceProvider or bootstrap/app.php)
Route::pattern('id', '[0-9]+'); // All {id} params must be numeric
```

### 6.3 Named Routes

```php
Route::get('/user/profile', [ProfileController::class, 'show'])
    ->name('profile');

// Generate URL
$url = route('profile');                          // /user/profile
$url = route('profile', ['id' => 1]);             // /user/profile?id=1
$url = route('user.show', ['user' => $user]);     // /users/1 (with model)

// Redirect to named route
return redirect()->route('profile');
return to_route('profile');

// Check current route
if ($request->routeIs('profile')) { /* ... */ }
if ($request->routeIs('admin.*')) { /* ... */ }   // Wildcard
```

### 6.4 Route Groups

```php
// Middleware group
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/settings', [SettingsController::class, 'index']);
});

// Prefix group
Route::prefix('admin')->group(function () {
    Route::get('/users', ...);   // /admin/users
    Route::get('/orders', ...);  // /admin/orders
});

// Name prefix group
Route::name('admin.')->group(function () {
    Route::get('/users', ...)->name('users');  // admin.users
});

// Controller group (Laravel 9+)
Route::controller(OrderController::class)->group(function () {
    Route::get('/orders', 'index');
    Route::post('/orders', 'store');
});

// Combined
Route::prefix('api/v1')
    ->name('api.v1.')
    ->middleware(['auth:sanctum', 'throttle:api'])
    ->group(function () {
        Route::apiResource('products', ProductController::class);
    });
```

### 6.5 Resource Routes

```php
// Full resource (index, create, show, edit, update, store, destroy)
Route::resource('photos', PhotoController::class);

// API resource (no create/edit — those are form routes)
Route::apiResource('photos', PhotoController::class);

// Multiple API resources
Route::apiResources([
    'photos'  => PhotoController::class,
    'videos'  => VideoController::class,
]);

// Partial resource
Route::resource('photos', PhotoController::class)
    ->only(['index', 'show']);

Route::resource('photos', PhotoController::class)
    ->except(['destroy']);

// Nested resource
Route::resource('photos.comments', CommentController::class);
// Generates: /photos/{photo}/comments/{comment}

// Shallow nesting
Route::resource('photos.comments', CommentController::class)->shallow();
// Generates parent-scoped for index/create/store, flat for show/edit/update/destroy

// Singleton resource (no index, no params)
Route::singleton('profile', ProfileController::class);
```

**Generated Resource Routes:**

| Verb | URI | Action | Route Name |
|------|-----|--------|------------|
| GET | `/photos` | index | photos.index |
| GET | `/photos/create` | create | photos.create |
| POST | `/photos` | store | photos.store |
| GET | `/photos/{photo}` | show | photos.show |
| GET | `/photos/{photo}/edit` | edit | photos.edit |
| PUT/PATCH | `/photos/{photo}` | update | photos.update |
| DELETE | `/photos/{photo}` | destroy | photos.destroy |

### 6.6 Route Model Binding

```php
// Implicit binding — variable name matches the parameter name
Route::get('/users/{user}', function (User $user) {
    return $user; // Auto-resolved by ID, 404 if not found
});

// Custom column
Route::get('/users/{user:slug}', function (User $user) {
    return $user; // Resolved by slug column
});

// In the model — default key for route binding
class User extends Model {
    public function getRouteKeyName(): string {
        return 'slug'; // Always use slug instead of id
    }
}

// Explicit binding (in RouteServiceProvider or bootstrap/app.php)
Route::model('user', User::class);

// Custom resolution logic
Route::bind('user', function (string $value) {
    return User::where('username', $value)
               ->orWhere('id', $value)
               ->firstOrFail();
});

// Scoped binding — ensures child belongs to parent
Route::get('/users/{user}/posts/{post:slug}', function (User $user, Post $post) {
    return $post; // post.user_id must match user.id
})->scopeBindings();

// Soft-deleted models
Route::get('/users/{user}', function (User $user) {
    return $user;
})->withTrashed();
```

### 6.7 Fallback Routes

```php
// Catch-all for undefined routes (must be last)
Route::fallback(function () {
    return response()->view('errors.404', [], 404);
});
```

---

## 7. Middleware

### 7.1 Creating Middleware

```bash
php artisan make:middleware EnsureTokenIsValid
```

```php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureTokenIsValid
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->input('token') !== 'my-secret-token') {
            return redirect('/home');
        }

        return $next($request); // Pass to next middleware
    }
}
```

### 7.2 Before & After Middleware

```php
// BEFORE middleware — runs before the request hits the controller
public function handle(Request $request, Closure $next): Response
{
    // Do something before ...
    return $next($request);
}

// AFTER middleware — runs after the controller returns a response
public function handle(Request $request, Closure $next): Response
{
    $response = $next($request);
    // Do something after ...
    $response->header('X-Custom-Header', 'value');
    return $response;
}

// Terminable middleware — runs after the response is sent to browser
public function terminate(Request $request, Response $response): void
{
    // Log, cleanup, etc.
}
```

### 7.3 Registering Middleware

```php
// ─── Laravel 10 (Kernel.php) ───────────────────
// app/Http/Kernel.php

// Global middleware (runs on every request)
protected $middleware = [
    \Illuminate\Http\Middleware\HandleCors::class,
    \App\Http\Middleware\TrustProxies::class,
    \Illuminate\Foundation\Http\Middleware\PreventRequestsDuringMaintenance::class,
];

// Middleware groups
protected $middlewareGroups = [
    'web' => [
        \Illuminate\Cookie\Middleware\EncryptCookies::class,
        \Illuminate\Session\Middleware\StartSession::class,
        \Illuminate\View\Middleware\ShareErrorsFromSession::class,
        \App\Http\Middleware\VerifyCsrfToken::class,
    ],
    'api' => [
        \Illuminate\Routing\Middleware\ThrottleRequests::class.':api',
        \Illuminate\Routing\Middleware\SubstituteBindings::class,
    ],
];

// Route middleware aliases
protected $middlewareAliases = [
    'auth'       => \App\Http\Middleware\Authenticate::class,
    'guest'      => \App\Http\Middleware\RedirectIfAuthenticated::class,
    'throttle'   => \Illuminate\Routing\Middleware\ThrottleRequests::class,
    'verified'   => \Illuminate\Auth\Middleware\EnsureEmailIsVerified::class,
    'role'       => \App\Http\Middleware\CheckRole::class,
];


// ─── Laravel 11 (bootstrap/app.php) ───────────
->withMiddleware(function (Middleware $middleware) {
    // Append to web group
    $middleware->web(append: [
        \App\Http\Middleware\CustomMiddleware::class,
    ]);

    // Prepend to api group
    $middleware->api(prepend: [
        \App\Http\Middleware\EnsureJsonResponse::class,
    ]);

    // Global middleware
    $middleware->append(\App\Http\Middleware\LogRequests::class);

    // Alias
    $middleware->alias([
        'role' => \App\Http\Middleware\CheckRole::class,
    ]);
})
```

### 7.4 Middleware Parameters

```php
class CheckRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        if (! $request->user()?->hasAnyRole($roles)) {
            abort(403, 'Unauthorized');
        }

        return $next($request);
    }
}

// Usage in routes
Route::get('/admin', [AdminController::class, 'index'])
    ->middleware('role:admin,superadmin');
```

### 7.5 Middleware Priority

```php
// Control execution order (Laravel 10 — Kernel.php)
protected $middlewarePriority = [
    \Illuminate\Foundation\Http\Middleware\HandlePrecognitiveRequests::class,
    \Illuminate\Cookie\Middleware\EncryptCookies::class,
    \Illuminate\Session\Middleware\StartSession::class,
    \Illuminate\Auth\Middleware\Authenticate::class,
    \Illuminate\Routing\Middleware\ThrottleRequests::class,
    \Illuminate\Routing\Middleware\SubstituteBindings::class,
    \Illuminate\Auth\Middleware\Authorize::class,
];
```

---

## 8. Controllers

### 8.1 Basic Controller

```bash
php artisan make:controller UserController
php artisan make:controller UserController --resource     # With resource methods
php artisan make:controller UserController --api          # API resource (no create/edit)
php artisan make:controller UserController --invokable    # Single-action
php artisan make:controller UserController --model=User   # With model type-hints
```

```php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        $users = User::paginate(20);
        return view('users.index', compact('users'));
    }

    public function show(User $user)
    {
        return view('users.show', compact('user'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'  => 'required|string|max:255',
            'email' => 'required|email|unique:users',
        ]);

        $user = User::create($validated);
        return redirect()->route('users.show', $user);
    }
}
```

### 8.2 Single Action Controller (Invokable)

```php
class ShowDashboard extends Controller
{
    public function __invoke(Request $request)
    {
        return view('dashboard', [
            'stats' => $this->getStats(),
        ]);
    }
}

// Route — no method needed
Route::get('/dashboard', ShowDashboard::class);
```

### 8.3 Constructor Injection

```php
class OrderController extends Controller
{
    public function __construct(
        private OrderService $orderService,
        private PaymentGatewayInterface $gateway
    ) {}

    public function store(StoreOrderRequest $request)
    {
        $order = $this->orderService->create($request->validated());
        $this->gateway->charge($order->total);
        return new OrderResource($order);
    }
}
```

### 8.4 Resource Controller Methods

```php
class PhotoController extends Controller
{
    public function index() {}                     // GET    /photos
    public function create() {}                    // GET    /photos/create
    public function store(Request $request) {}     // POST   /photos
    public function show(Photo $photo) {}          // GET    /photos/{photo}
    public function edit(Photo $photo) {}          // GET    /photos/{photo}/edit
    public function update(Request $request, Photo $photo) {} // PUT /photos/{photo}
    public function destroy(Photo $photo) {}       // DELETE /photos/{photo}
}
```

---

## 9. Request & Response

### 9.1 Accessing the Request

```php
use Illuminate\Http\Request;

public function store(Request $request)
{
    // URL & path
    $url  = $request->url();                   // Without query string
    $full = $request->fullUrl();               // With query string
    $path = $request->path();                  // users/1
    $method = $request->method();              // GET, POST, etc.
    $isPost = $request->isMethod('post');

    // Input data (query + body)
    $name   = $request->input('name');                  // Any source
    $name   = $request->input('name', 'default');       // With default
    $nested = $request->input('products.0.name');       // Nested/dot notation
    $all    = $request->all();                          // All input
    $only   = $request->only(['name', 'email']);        // Whitelist
    $except = $request->except(['password']);            // Blacklist

    // Query string only
    $search = $request->query('search');
    $search = $request->query('search', 'default');

    // Boolean inputs
    $active = $request->boolean('active');              // Truthy: 1, "1", "true", "on", "yes"

    // Date inputs
    $date = $request->date('birthday');                 // Returns Carbon instance
    $date = $request->date('birthday', 'Y-m-d');       // With format

    // Enum inputs
    $status = $request->enum('status', OrderStatus::class);

    // Check existence
    $request->has('name');                              // true if present (even empty)
    $request->has(['name', 'email']);                   // true if ALL present
    $request->hasAny(['name', 'email']);                // true if ANY present
    $request->filled('name');                           // true if present AND not empty
    $request->missing('name');                          // true if not present
    $request->whenHas('name', fn($input) => ...);      // Callback if present
    $request->whenFilled('name', fn($input) => ...);   // Callback if filled

    // Merge / defaults
    $request->merge(['name' => 'override']);
    $request->mergeIfMissing(['name' => 'fallback']);

    // Headers
    $token = $request->header('Authorization');
    $token = $request->bearerToken();

    // Content type
    $request->is('admin/*');                            // Pattern match on path
    $request->expectsJson();                            // Accepts: application/json
    $request->wantsJson();                              // Alias

    // IP & User Agent
    $ip = $request->ip();
    $ua = $request->userAgent();
}
```

### 9.2 Files

```php
// Check for file
if ($request->hasFile('photo')) {
    $file = $request->file('photo');

    // File info
    $file->isValid();
    $file->getClientOriginalName();      // photo.jpg
    $file->getClientOriginalExtension(); // jpg
    $file->getClientMimeType();          // image/jpeg
    $file->getSize();                    // bytes

    // Store file
    $path = $file->store('photos');                           // storage/app/photos/random.jpg
    $path = $file->store('photos', 'public');                 // storage/app/public/photos/random.jpg
    $path = $file->storeAs('photos', 'custom-name.jpg');      // Custom name
    $path = $file->storePublicly('photos');                   // Public visibility (S3)
}

// Validation for files
$request->validate([
    'photo' => 'required|image|mimes:jpg,png|max:2048',        // max in KB
    'document' => 'required|file|mimetypes:application/pdf|max:10240',
    'photos.*' => 'image|max:2048',                             // Multiple files
]);
```

### 9.3 Responses

```php
// String response
return 'Hello World';

// Array response (auto-converted to JSON)
return ['name' => 'John', 'age' => 30];

// View response
return view('welcome', ['name' => 'John']);

// JSON response
return response()->json([
    'message' => 'Success',
    'data'    => $user,
], 200);

// JSON with headers
return response()->json($data)
    ->header('X-Custom', 'value')
    ->withHeaders([
        'X-Another' => 'value',
        'X-Third'   => 'value',
    ]);

// Download response
return response()->download($pathToFile);
return response()->download($pathToFile, 'custom-name.pdf', $headers);

// File display (inline, e.g., PDF in browser)
return response()->file($pathToFile);

// Streamed download (generate on-the-fly)
return response()->streamDownload(function () {
    echo 'CSV,data,here';
}, 'export.csv');

// No content
return response()->noContent();       // 204

// Redirect responses
return redirect('/home');
return redirect()->route('users.show', ['user' => 1]);
return redirect()->action([UserController::class, 'index']);
return redirect()->back();
return redirect()->back()->withInput();
return redirect()->back()->with('status', 'Profile updated!');
return redirect()->away('https://google.com');

// Abort
abort(404);
abort(403, 'Unauthorized');
abort_if(! $user->isAdmin(), 403);
abort_unless($user->isAdmin(), 403);
```

### 9.4 Response Macros

```php
// In a service provider
use Illuminate\Support\Facades\Response;

Response::macro('success', function (mixed $data = null, string $message = 'OK') {
    return Response::json([
        'success' => true,
        'message' => $message,
        'data'    => $data,
    ]);
});

Response::macro('error', function (string $message, int $code = 400) {
    return Response::json([
        'success' => false,
        'message' => $message,
    ], $code);
});

// Usage
return response()->success($user, 'User created');
return response()->error('Validation failed', 422);
```

---

## 10. Validation

### 10.1 Basic Validation (in Controller)

```php
public function store(Request $request)
{
    $validated = $request->validate([
        'title'       => 'required|string|max:255',
        'body'        => 'required|string|min:10',
        'category_id' => 'required|exists:categories,id',
        'tags'        => 'nullable|array|max:5',
        'tags.*'      => 'string|max:50',
        'email'       => 'required|email:rfc,dns|unique:users,email',
        'password'    => ['required', 'string', 'min:8', 'confirmed'],
        'publish_at'  => 'nullable|date|after:today',
        'image'       => 'nullable|image|dimensions:min_width=100,max_width=2000',
    ]);

    // $validated only contains validated fields
    Post::create($validated);
}
```

### 10.2 Form Request Classes

```bash
php artisan make:request StorePostRequest
```

```php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePostRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('create', Post::class);
    }

    /**
     * Validation rules.
     */
    public function rules(): array
    {
        return [
            'title'       => ['required', 'string', 'max:255'],
            'slug'        => ['required', 'string', Rule::unique('posts')->ignore($this->post)],
            'body'        => ['required', 'string', 'min:10'],
            'status'      => ['required', Rule::in(['draft', 'published', 'archived'])],
            'category_id' => ['required', 'exists:categories,id'],
            'tags'        => ['nullable', 'array', 'max:10'],
            'tags.*.name' => ['required_with:tags', 'string', 'max:50'],
        ];
    }

    /**
     * Custom error messages.
     */
    public function messages(): array
    {
        return [
            'title.required'  => 'Every post needs a title!',
            'body.min'        => 'The body must be at least :min characters.',
            'category_id.exists' => 'The selected category does not exist.',
        ];
    }

    /**
     * Custom attribute names for error messages.
     */
    public function attributes(): array
    {
        return [
            'category_id' => 'category',
        ];
    }

    /**
     * Prepare input data before validation.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'slug' => Str::slug($this->title),
        ]);
    }

    /**
     * Handle a passed validation attempt (after validation succeeds).
     */
    protected function passedValidation(): void
    {
        $this->replace([
            'title' => strip_tags($this->title),
        ]);
    }
}
```

### 10.3 Complete Validation Rules Reference

```php
// ── String Rules ──────────────────────────
'required'                    // Must be present and not empty
'nullable'                    // Can be null
'string'                      // Must be a string
'alpha'                       // Only letters
'alpha_num'                   // Letters + numbers
'alpha_dash'                  // Letters, numbers, dashes, underscores
'min:3'                       // Minimum length/value
'max:255'                     // Maximum length/value
'between:1,100'               // Between min and max
'size:10'                     // Exact length
'starts_with:foo,bar'         // Starts with one of the values
'ends_with:foo,bar'           // Ends with one of the values
'regex:/^[A-Z]+$/'            // Match regex pattern
'not_regex:/pattern/'         // Must NOT match regex
'uppercase'                   // Must be uppercase
'lowercase'                   // Must be lowercase
'json'                        // Valid JSON string
'url'                         // Valid URL
'active_url'                  // Valid URL with DNS record
'email'                       // Valid email
'email:rfc,dns'               // Stricter email validation
'ip'                          // Valid IP address
'ipv4'                        // Valid IPv4
'ipv6'                        // Valid IPv6
'mac_address'                 // Valid MAC address
'uuid'                        // Valid UUID
'ulid'                        // Valid ULID

// ── Numeric Rules ─────────────────────────
'integer'                     // Must be an integer
'numeric'                     // Must be numeric (int or float)
'decimal:2'                   // Exactly 2 decimal places
'decimal:2,4'                 // Between 2 and 4 decimal places
'digits:5'                    // Exactly N digits
'digits_between:3,5'          // Between N and M digits
'gt:0'                        // Greater than
'gte:0'                       // Greater than or equal
'lt:100'                      // Less than
'lte:100'                     // Less than or equal
'multiple_of:5'               // Must be a multiple of N

// ── Comparison Rules ──────────────────────
'same:password_confirmation'  // Must match another field
'different:old_password'      // Must differ from another field
'confirmed'                   // Requires {field}_confirmation
'gt:other_field'              // Greater than another field
'gte:other_field'             // Greater/equal another field
'lt:other_field'              // Less than another field
'lte:other_field'             // Less/equal another field
'in:foo,bar,baz'              // Must be in the list
'not_in:foo,bar'              // Must NOT be in the list

// ── Date Rules ────────────────────────────
'date'                        // Valid date
'date_format:Y-m-d'           // Specific format
'before:2026-01-01'           // Before a date
'before_or_equal:today'       // Before or equal
'after:today'                 // After a date
'after_or_equal:start_date'   // After or equal to another field

// ── Array Rules ───────────────────────────
'array'                       // Must be an array
'array:key1,key2'             // Only these keys allowed
'list'                        // Must be a list (sequential keys) [Laravel 11]
'distinct'                    // No duplicate values in array
'in_array:other_field.*'      // Must exist in another array field

// ── File Rules ────────────────────────────
'file'                        // Must be a file
'image'                       // Must be an image (jpg, png, gif, bmp, svg, webp)
'mimes:jpg,png,pdf'           // Allowed MIME extensions
'mimetypes:image/jpeg'        // Allowed MIME types
'max:2048'                    // Max size in KB
'min:100'                     // Min size in KB
'dimensions:min_width=100,min_height=100'

// ── Database Rules ────────────────────────
'exists:table,column'         // Must exist in database
'unique:table,column'         // Must be unique
Rule::exists('users', 'id')->where('active', true)
Rule::unique('users', 'email')->ignore($user->id)
Rule::unique('users', 'email')->where('account_id', $accountId)

// ── Conditional Rules ─────────────────────
'required_if:role,admin'      // Required if another field = value
'required_unless:role,guest'  // Required unless another field = value
'required_with:first_name'    // Required if another field is present
'required_with_all:a,b'       // Required if ALL other fields present
'required_without:email'      // Required if another field is NOT present
'required_without_all:a,b'    // Required if ALL other fields absent
'exclude_if:role,guest'       // Exclude from validated data if condition
'exclude_unless:role,admin'   // Exclude unless condition
'prohibits:other_field'       // Other field must not be present
'prohibited'                  // Field must not be present
'prohibited_if:role,guest'    // Prohibited if condition
'prohibited_unless:role,admin'// Prohibited unless condition
'present'                     // Must be present (can be empty)
'filled'                      // Must not be empty if present
'sometimes'                   // Only validate if present

// ── Password Rules (Laravel 9+) ──────────
'password' => ['required', Password::min(8)
    ->letters()
    ->mixedCase()
    ->numbers()
    ->symbols()
    ->uncompromised()          // Check haveibeenpwned.com
],
```

### 10.4 Custom Validation Rules

```bash
php artisan make:rule Uppercase
```

```php
// Invokable Rule (Laravel 10+)
namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class Uppercase implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (strtoupper($value) !== $value) {
            $fail('The :attribute must be uppercase.');
        }
    }
}

// Usage
$request->validate([
    'name' => ['required', new Uppercase],
]);

// Closure-based rule (inline)
$request->validate([
    'name' => [
        'required',
        function (string $attribute, mixed $value, Closure $fail) {
            if (strtoupper($value) !== $value) {
                $fail("The {$attribute} must be uppercase.");
            }
        },
    ],
]);
```

---

## 11. Blade Templating

### 11.1 Displaying Data

```blade
{{-- Echo (auto-escaped) --}}
<h1>{{ $title }}</h1>
<p>{{ $user->name }}</p>

{{-- Unescaped output (careful — XSS risk) --}}
{!! $html !!}

{{-- Default value --}}
{{ $name ?? 'Guest' }}

{{-- Blade comments (not sent to browser) --}}
{{-- This is a comment --}}

{{-- Disable double encoding --}}
{{ e($alreadyEncoded) }}

{{-- Render JSON --}}
<script>
    var app = @json($data);
    var config = @json($config, JSON_PRETTY_PRINT);
</script>

{{-- Verbatim (prevent Blade parsing) --}}
@verbatim
    <div>{{ This is not parsed by Blade }}</div>
@endverbatim
```

### 11.2 Control Structures

```blade
{{-- If / Else --}}
@if (count($records) === 1)
    <p>One record!</p>
@elseif (count($records) > 1)
    <p>Multiple records!</p>
@else
    <p>No records!</p>
@endif

@unless ($user->isAdmin())
    <p>You are not an admin.</p>
@endunless

@isset($records)
    {{-- $records is defined and not null --}}
@endisset

@empty($records)
    {{-- $records is empty --}}
@endempty

{{-- Switch --}}
@switch($role)
    @case('admin')
        <p>Admin panel</p>
        @break
    @case('editor')
        <p>Editor panel</p>
        @break
    @default
        <p>User panel</p>
@endswitch

{{-- Authentication --}}
@auth
    <p>Hello {{ auth()->user()->name }}</p>
@endauth

@guest
    <p>Please log in</p>
@endguest

@auth('admin')
    {{-- Authenticated with 'admin' guard --}}
@endauth

{{-- Environment --}}
@env('local')
    <p>Local environment</p>
@endenv

@production
    {{-- Only in production --}}
@endproduction

{{-- Session --}}
@session('status')
    <div class="alert alert-success">{{ $value }}</div>
@endsession
```

### 11.3 Loops

```blade
{{-- For --}}
@for ($i = 0; $i < 10; $i++)
    <p>Value: {{ $i }}</p>
@endfor

{{-- Foreach --}}
@foreach ($users as $user)
    <p>{{ $user->name }}</p>
@endforeach

{{-- Forelse (with empty fallback) --}}
@forelse ($users as $user)
    <li>{{ $user->name }}</li>
@empty
    <li>No users found.</li>
@endforelse

{{-- While --}}
@while (true)
    <p>Looping forever.</p>
    @break
@endwhile

{{-- Loop variable --}}
@foreach ($users as $user)
    @if ($loop->first) <strong>First!</strong> @endif
    @if ($loop->last) <strong>Last!</strong> @endif

    <p>{{ $loop->iteration }} / {{ $loop->count }}</p>
    {{-- $loop->index        — 0-based index --}}
    {{-- $loop->iteration    — 1-based iteration --}}
    {{-- $loop->remaining    — iterations remaining --}}
    {{-- $loop->count        — total items --}}
    {{-- $loop->first        — is first iteration --}}
    {{-- $loop->last         — is last iteration --}}
    {{-- $loop->even         — is even iteration --}}
    {{-- $loop->odd          — is odd iteration --}}
    {{-- $loop->depth        — nesting depth (1-based) --}}
    {{-- $loop->parent       — parent's $loop (nested loops) --}}

    @if ($loop->even)
        <tr class="even">...</tr>
    @endif

    @continue($user->isHidden())
    @break($user->id === 5)
@endforeach
```

### 11.4 Layouts & Components

```blade
{{-- ═══ Layouts via Components (Modern — Recommended) ═══ --}}

{{-- resources/views/components/layouts/app.blade.php --}}
<!DOCTYPE html>
<html>
<head>
    <title>{{ $title ?? 'My App' }}</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body>
    <nav>{{ $header ?? '' }}</nav>
    <main>{{ $slot }}</main>
    <footer>{{ $footer ?? '' }}</footer>
</body>
</html>

{{-- resources/views/dashboard.blade.php --}}
<x-layouts.app title="Dashboard">
    <x-slot:header>
        <h1>Dashboard</h1>
    </x-slot>

    <p>Welcome to the dashboard!</p>

    <x-slot:footer>
        <p>&copy; 2026</p>
    </x-slot>
</x-layouts.app>


{{-- ═══ Layouts via Template Inheritance (Classic) ═══ --}}

{{-- resources/views/layouts/app.blade.php --}}
<!DOCTYPE html>
<html>
<head>
    <title>@yield('title', 'Default Title')</title>
    @stack('styles')
</head>
<body>
    @include('partials.navbar')

    <div class="container">
        @yield('content')
    </div>

    @stack('scripts')
</body>
</html>

{{-- resources/views/pages/home.blade.php --}}
@extends('layouts.app')

@section('title', 'Home Page')

@section('content')
    <h1>Welcome Home</h1>
    @parent {{-- Include parent section content --}}
@endsection

@push('scripts')
    <script src="/js/home.js"></script>
@endpush

@push('styles')
    <link rel="stylesheet" href="/css/home.css">
@endpush
```

### 11.5 Blade Components

```blade
{{-- ═══ Anonymous Components ═══ --}}

{{-- resources/views/components/alert.blade.php --}}
@props([
    'type' => 'info',          // Default value
    'dismissible' => false,
])

<div {{ $attributes->merge(['class' => "alert alert-{$type}"]) }}
     @if($dismissible) x-data="{ open: true }" x-show="open" @endif>
    {{ $slot }}
    @if($dismissible)
        <button @click="open = false">&times;</button>
    @endif
</div>

{{-- Usage --}}
<x-alert type="success" dismissible>
    Your profile has been updated!
</x-alert>

<x-alert type="danger" class="mt-4" id="custom-id">
    Something went wrong!
</x-alert>


{{-- ═══ Class-Based Components ═══ --}}
{{-- php artisan make:component Alert --}}

{{-- app/View/Components/Alert.php --}}
namespace App\View\Components;

use Closure;
use Illuminate\View\Component;
use Illuminate\Contracts\View\View;

class Alert extends Component
{
    public function __construct(
        public string $type = 'info',
        public bool $dismissible = false,
    ) {}

    /**
     * Computed property available in the view.
     */
    public function iconClass(): string
    {
        return match($this->type) {
            'success' => 'fa-check-circle',
            'danger'  => 'fa-exclamation-circle',
            'warning' => 'fa-exclamation-triangle',
            default   => 'fa-info-circle',
        };
    }

    /**
     * Whether the component should be rendered.
     */
    public function shouldRender(): bool
    {
        return true;
    }

    public function render(): View|Closure|string
    {
        return view('components.alert');
    }
}

{{-- resources/views/components/alert.blade.php --}}
<div {{ $attributes->merge(['class' => "alert alert-{$type}"]) }}>
    <i class="fa {{ $iconClass() }}"></i>
    {{ $slot }}
</div>
```

### 11.6 Attributes & Slots

```blade
{{-- ═══ Attribute Manipulation ═══ --}}
@props(['type' => 'button'])

{{-- Merge classes --}}
<button {{ $attributes->merge(['class' => 'btn btn-primary']) }}>
    {{ $slot }}
</button>
{{-- <x-button class="mt-4"> → class="btn btn-primary mt-4" --}}

{{-- Conditionally merge --}}
<div {{ $attributes->class([
    'p-4',
    'bg-red' => $hasError,
    'font-bold' => $isActive,
]) }}>

{{-- Filter attributes --}}
{{ $attributes->filter(fn($val, $key) => $key !== 'class') }}

{{-- Get specific attribute --}}
{{ $attributes->get('class') }}

{{-- Check for attribute --}}
@if ($attributes->has('disabled'))
    ...
@endif

{{-- ═══ Named Slots ═══ --}}
<x-card>
    <x-slot:title>Card Title</x-slot>
    <x-slot:actions>
        <button>Save</button>
    </x-slot>

    <p>Default slot content</p>
</x-card>

{{-- In the component: --}}
<div class="card">
    <div class="card-header">{{ $title }}</div>
    <div class="card-body">{{ $slot }}</div>
    <div class="card-footer">{{ $actions ?? '' }}</div>
</div>
```

### 11.7 Including Views

```blade
@include('partials.sidebar')
@include('partials.sidebar', ['menu' => $sidebarMenu])
@includeIf('partials.sidebar')              {{-- Only if exists --}}
@includeWhen($showSidebar, 'partials.sidebar')
@includeUnless($hideSidebar, 'partials.sidebar')
@includeFirst(['custom.sidebar', 'partials.sidebar'])

{{-- Render partial for each item --}}
@each('partials.user-card', $users, 'user')
@each('partials.user-card', $users, 'user', 'partials.no-users')
```

### 11.8 Custom Blade Directives

```php
// In a service provider's boot() method
use Illuminate\Support\Facades\Blade;

Blade::directive('datetime', function (string $expression) {
    return "<?php echo ($expression)->format('M d, Y H:i'); ?>";
});

Blade::directive('money', function (string $expression) {
    return "<?php echo '$' . number_format($expression, 2); ?>";
});

// Usage in Blade
@datetime($post->created_at)
@money($product->price)

// Custom if directive
Blade::if('disk', function (string $value) {
    return config('filesystems.default') === $value;
});

// Usage
@disk('local')
    <p>Using local storage</p>
@elsedisk('s3')
    <p>Using S3</p>
@enddisk
```

---

## 12. Database — Migrations

### 12.1 Creating & Running

```bash
# Create migration
php artisan make:migration create_users_table
php artisan make:migration add_avatar_to_users_table
php artisan make:migration create_posts_table --create=posts
php artisan make:migration add_index_to_posts --table=posts

# Run migrations
php artisan migrate
php artisan migrate --seed            # Run seeders after
php artisan migrate --force           # Force in production
php artisan migrate --path=database/migrations/specific_file.php

# Rollback
php artisan migrate:rollback          # Rollback last batch
php artisan migrate:rollback --step=3 # Rollback N steps
php artisan migrate:reset             # Rollback ALL
php artisan migrate:refresh           # Rollback all + re-migrate
php artisan migrate:refresh --seed    # Refresh + seed
php artisan migrate:fresh             # DROP all tables + re-migrate
php artisan migrate:fresh --seed      # Fresh + seed

# Status
php artisan migrate:status
```

### 12.2 Column Types

```php
Schema::create('products', function (Blueprint $table) {
    // ── Primary Keys ──────────────────────
    $table->id();                                 // Auto-increment BIGINT (alias for bigIncrements)
    $table->uuid('id')->primary();                // UUID primary key
    $table->ulid('id')->primary();                // ULID primary key

    // ── String / Text ─────────────────────
    $table->string('name', 100);                  // VARCHAR(100)
    $table->char('code', 3);                      // CHAR(3)
    $table->text('description');                   // TEXT
    $table->mediumText('content');                 // MEDIUMTEXT
    $table->longText('body');                      // LONGTEXT
    $table->tinyText('note');                      // TINYTEXT

    // ── Numbers ───────────────────────────
    $table->integer('votes');                      // INT
    $table->tinyInteger('level');                  // TINYINT
    $table->smallInteger('rank');                  // SMALLINT
    $table->mediumInteger('mid_val');              // MEDIUMINT
    $table->bigInteger('big_val');                 // BIGINT
    $table->unsignedInteger('count');              // UNSIGNED INT
    $table->unsignedBigInteger('external_id');     // UNSIGNED BIGINT
    $table->float('amount', 8, 2);                // FLOAT
    $table->double('latitude', 10, 7);            // DOUBLE
    $table->decimal('price', 12, 2);              // DECIMAL

    // ── Boolean ───────────────────────────
    $table->boolean('is_active');                  // BOOLEAN (TINYINT(1))

    // ── Date / Time ───────────────────────
    $table->date('birthday');                      // DATE
    $table->dateTime('event_at');                  // DATETIME
    $table->dateTimeTz('event_at');                // DATETIME with timezone
    $table->time('alarm_at');                      // TIME
    $table->timeTz('alarm_at');                    // TIME with timezone
    $table->timestamp('verified_at');              // TIMESTAMP
    $table->timestampTz('verified_at');            // TIMESTAMP with timezone
    $table->timestamps();                          // created_at + updated_at
    $table->timestampsTz();                        // With timezone
    $table->softDeletes();                         // deleted_at TIMESTAMP
    $table->softDeletesTz();                       // With timezone
    $table->year('birth_year');                    // YEAR

    // ── Binary ────────────────────────────
    $table->binary('data');                        // BLOB

    // ── JSON ──────────────────────────────
    $table->json('options');                        // JSON
    $table->jsonb('metadata');                      // JSONB (PostgreSQL)

    // ── Enum ──────────────────────────────
    $table->enum('status', ['draft', 'published', 'archived']);
    $table->set('flags', ['bold', 'italic']);       // SET type (MySQL)

    // ── Geometry (spatial) ────────────────
    $table->geometry('location');
    $table->point('coordinates');
    $table->lineString('path');
    $table->polygon('area');

    // ── Foreign Keys ──────────────────────
    $table->foreignId('user_id')->constrained();   // BIGINT UNSIGNED + FK to users.id
    $table->foreignId('user_id')
          ->constrained()
          ->cascadeOnUpdate()
          ->cascadeOnDelete();
    $table->foreignId('category_id')
          ->nullable()
          ->constrained()
          ->nullOnDelete();                        // SET NULL on delete
    $table->foreignUuid('team_id')->constrained(); // UUID FK
    $table->foreignUlid('team_id')->constrained(); // ULID FK

    // ── Morphs ────────────────────────────
    $table->morphs('commentable');                 // commentable_id + commentable_type
    $table->nullableMorphs('taggable');
    $table->uuidMorphs('taggable');                // UUID morph columns
    $table->ulidMorphs('taggable');                // ULID morph columns

    // ── Special ───────────────────────────
    $table->rememberToken();                       // remember_token VARCHAR(100)
    $table->ipAddress('visitor_ip');
    $table->macAddress('device_mac');
});
```

### 12.3 Column Modifiers

```php
$table->string('name')->nullable();                // Allow NULL
$table->string('name')->default('Guest');          // Default value
$table->integer('votes')->unsigned();              // UNSIGNED
$table->string('email')->unique();                 // Unique constraint
$table->integer('position')->autoIncrement();      // Auto-increment
$table->text('bio')->comment('User biography');    // Column comment
$table->string('name')->charset('utf8mb4');        // Character set
$table->string('name')->collation('utf8mb4_unicode_ci');
$table->string('name')->after('email');            // Column position (MySQL)
$table->string('name')->first();                   // First column (MySQL)
$table->string('name')->invisible();               // Hidden from SELECT * (MySQL 8+)
$table->string('name')->useCurrent();              // CURRENT_TIMESTAMP default
$table->string('name')->useCurrentOnUpdate();      // Update to CURRENT_TIMESTAMP
$table->integer('amount')->generatedAs('price * quantity'); // Computed column
$table->integer('amount')->storedAs('price * quantity');    // Stored computed
$table->integer('amount')->virtualAs('price * quantity');   // Virtual computed
```

### 12.4 Indexes

```php
// Index types
$table->primary('id');                             // Primary key
$table->primary(['first', 'last']);                 // Composite primary
$table->unique('email');                           // Unique index
$table->unique(['email', 'tenant_id']);             // Composite unique
$table->index('state');                            // Regular index
$table->index(['state', 'city']);                   // Composite index
$table->fullText('body');                          // Full-text index
$table->spatialIndex('location');                  // Spatial index

// Named indexes
$table->index('state', 'idx_users_state');

// Drop indexes
$table->dropPrimary('users_id_primary');
$table->dropUnique('users_email_unique');
$table->dropIndex('users_state_index');
$table->dropFullText('posts_body_fulltext');

// Foreign key constraints
$table->foreign('user_id')->references('id')->on('users');
$table->foreign('user_id')
      ->references('id')
      ->on('users')
      ->onDelete('cascade')
      ->onUpdate('cascade');
$table->dropForeign('posts_user_id_foreign');
$table->dropForeign(['user_id']);                  // Convention-based
```

### 12.5 Table Operations

```php
// Rename table
Schema::rename('old_name', 'new_name');

// Drop table
Schema::drop('users');
Schema::dropIfExists('users');

// Check existence
Schema::hasTable('users');
Schema::hasColumn('users', 'email');
Schema::hasColumns('users', ['email', 'name']);

// Modify table
Schema::table('users', function (Blueprint $table) {
    // Add column
    $table->string('phone')->nullable()->after('email');

    // Rename column
    $table->renameColumn('old_name', 'new_name');

    // Change column type (requires doctrine/dbal for Laravel 10,
    // built-in for Laravel 11)
    $table->string('name', 50)->change();
    $table->integer('votes')->unsigned()->default(0)->change();

    // Drop column
    $table->dropColumn('votes');
    $table->dropColumn(['votes', 'avatar']);

    // Drop timestamps, soft deletes, etc.
    $table->dropTimestamps();
    $table->dropSoftDeletes();
    $table->dropRememberToken();
    $table->dropMorphs('commentable');
});
```

---

## 13. Database — Query Builder

### 13.1 Basic Queries

```php
use Illuminate\Support\Facades\DB;

// Select all
$users = DB::table('users')->get();

// Select specific columns
$users = DB::table('users')->select('name', 'email as user_email')->get();

// Add columns
$query = DB::table('users')->select('name');
$users = $query->addSelect('age')->get();

// Distinct
$emails = DB::table('users')->distinct()->get();

// Single row
$user = DB::table('users')->where('name', 'John')->first();
$user = DB::table('users')->find(1);              // By ID

// Single value
$email = DB::table('users')->where('name', 'John')->value('email');

// Pluck (key-value pairs)
$names = DB::table('users')->pluck('name');        // Collection of names
$names = DB::table('users')->pluck('name', 'id');  // ['1' => 'John', ...]

// Chunking (memory efficient)
DB::table('users')->orderBy('id')->chunk(200, function ($users) {
    foreach ($users as $user) {
        // Process...
    }
    // return false;  // to stop chunking
});

// Lazy collections
DB::table('users')->orderBy('id')->lazy()->each(function ($user) {
    // Process one at a time
});

// Aggregates
$count   = DB::table('users')->count();
$max     = DB::table('orders')->max('price');
$min     = DB::table('orders')->min('price');
$avg     = DB::table('orders')->avg('price');
$sum     = DB::table('orders')->sum('price');
$exists  = DB::table('orders')->where('id', 1)->exists();
$missing = DB::table('orders')->where('id', 999)->doesntExist();
```

### 13.2 Where Clauses

```php
// Basic where
DB::table('users')->where('votes', '=', 100)->get();
DB::table('users')->where('votes', 100)->get();          // = is default
DB::table('users')->where('votes', '>=', 100)->get();
DB::table('users')->where('name', 'like', '%John%')->get();
DB::table('users')->where('votes', '<>', 100)->get();

// Multiple conditions (AND)
DB::table('users')
    ->where('status', 'active')
    ->where('votes', '>', 50)
    ->get();

// Array of conditions
DB::table('users')->where([
    ['status', '=', 'active'],
    ['votes', '>', 50],
])->get();

// OR
DB::table('users')
    ->where('votes', '>', 100)
    ->orWhere('name', 'John')
    ->get();

// OR with grouping
DB::table('users')
    ->where('votes', '>', 100)
    ->orWhere(function ($query) {
        $query->where('name', 'John')
              ->where('votes', '>', 50);
    })
    ->get();
// WHERE votes > 100 OR (name = 'John' AND votes > 50)

// Where NOT
DB::table('users')
    ->whereNot(function ($query) {
        $query->where('status', 'archived')
              ->orWhere('role', 'banned');
    })
    ->get();

// JSON where (MySQL/PostgreSQL)
DB::table('users')
    ->where('preferences->language', 'en')
    ->get();

DB::table('users')
    ->whereJsonContains('tags', 'laravel')
    ->get();

DB::table('users')
    ->whereJsonLength('tags', '>', 2)
    ->get();

// Between
DB::table('users')->whereBetween('votes', [1, 100])->get();
DB::table('users')->whereNotBetween('votes', [1, 100])->get();

// In
DB::table('users')->whereIn('id', [1, 2, 3])->get();
DB::table('users')->whereNotIn('id', [1, 2, 3])->get();

// Null
DB::table('users')->whereNull('deleted_at')->get();
DB::table('users')->whereNotNull('email_verified_at')->get();

// Date
DB::table('users')->whereDate('created_at', '2026-01-01')->get();
DB::table('users')->whereMonth('created_at', '12')->get();
DB::table('users')->whereDay('created_at', '15')->get();
DB::table('users')->whereYear('created_at', '2026')->get();
DB::table('users')->whereTime('created_at', '>=', '10:00:00')->get();

// Column comparison
DB::table('users')
    ->whereColumn('first_name', 'last_name')      // Equal
    ->get();
DB::table('users')
    ->whereColumn('updated_at', '>', 'created_at')
    ->get();

// Subquery where
DB::table('users')
    ->where('income', '>', function ($query) {
        $query->selectRaw('AVG(income)')->from('users');
    })
    ->get();

// Full-text search
DB::table('posts')
    ->whereFullText('body', 'Laravel framework')
    ->get();

// Conditional clauses (when)
DB::table('users')
    ->when($request->filled('role'), function ($query) use ($request) {
        $query->where('role', $request->role);
    })
    ->when($request->filled('sort'), function ($query) use ($request) {
        $query->orderBy($request->sort);
    }, function ($query) {
        $query->orderBy('created_at', 'desc');   // Default when condition is false
    })
    ->get();
```

### 13.3 Joins

```php
// Inner join
DB::table('users')
    ->join('contacts', 'users.id', '=', 'contacts.user_id')
    ->join('orders', 'users.id', '=', 'orders.user_id')
    ->select('users.*', 'contacts.phone', 'orders.total')
    ->get();

// Left / Right join
DB::table('users')
    ->leftJoin('posts', 'users.id', '=', 'posts.user_id')
    ->get();

DB::table('users')
    ->rightJoin('posts', 'users.id', '=', 'posts.user_id')
    ->get();

// Cross join
DB::table('sizes')
    ->crossJoin('colors')
    ->get();

// Advanced join
DB::table('users')
    ->join('contacts', function ($join) {
        $join->on('users.id', '=', 'contacts.user_id')
             ->where('contacts.type', '=', 'primary')
             ->orOn('users.id', '=', 'contacts.alt_user_id');
    })
    ->get();

// Subquery join
$latestPosts = DB::table('posts')
    ->select('user_id', DB::raw('MAX(created_at) as last_post_at'))
    ->groupBy('user_id');

DB::table('users')
    ->joinSub($latestPosts, 'latest_posts', function ($join) {
        $join->on('users.id', '=', 'latest_posts.user_id');
    })
    ->get();

// Lateral join (PostgreSQL)
DB::table('users')
    ->joinLateral(function ($query) {
        $query->from('posts')
              ->whereColumn('posts.user_id', 'users.id')
              ->orderByDesc('created_at')
              ->limit(3);
    }, 'recent_posts')
    ->get();
```

### 13.4 Ordering, Grouping, Limit

```php
// Order
DB::table('users')->orderBy('name', 'asc')->get();
DB::table('users')->orderByDesc('created_at')->get();
DB::table('users')->latest()->get();               // orderBy('created_at', 'desc')
DB::table('users')->oldest()->get();               // orderBy('created_at', 'asc')
DB::table('users')->inRandomOrder()->get();
DB::table('users')->reorder()->get();              // Remove all orderings
DB::table('users')->reorder('name', 'desc')->get();

// Group by / Having
DB::table('orders')
    ->select('department', DB::raw('SUM(price) as total'))
    ->groupBy('department')
    ->having('total', '>', 5000)
    ->get();

// Limit / Offset
DB::table('users')->skip(10)->take(5)->get();      // OFFSET 10 LIMIT 5
DB::table('users')->offset(10)->limit(5)->get();   // Same
DB::table('users')->forPage(3, 15)->get();         // Page 3, 15 per page
```

### 13.5 Insert, Update, Delete

```php
// Insert
DB::table('users')->insert([
    'name'  => 'John',
    'email' => 'john@example.com',
]);

// Insert multiple
DB::table('users')->insert([
    ['name' => 'John', 'email' => 'john@example.com'],
    ['name' => 'Jane', 'email' => 'jane@example.com'],
]);

// Insert and get ID
$id = DB::table('users')->insertGetId([
    'name'  => 'John',
    'email' => 'john@example.com',
]);

// Insert or ignore (skip duplicates)
DB::table('users')->insertOrIgnore([
    ['id' => 1, 'email' => 'a@a.com'],
    ['id' => 2, 'email' => 'b@b.com'],
]);

// Upsert (insert or update)
DB::table('flights')->upsert(
    [
        ['departure' => 'Oakland', 'destination' => 'San Diego', 'price' => 99],
        ['departure' => 'Chicago', 'destination' => 'New York', 'price' => 150],
    ],
    ['departure', 'destination'],  // Unique columns
    ['price']                       // Columns to update on conflict
);

// Update
DB::table('users')
    ->where('id', 1)
    ->update(['votes' => 1]);

// Update or insert
DB::table('users')
    ->updateOrInsert(
        ['email' => 'john@example.com'],          // Match criteria
        ['name' => 'John', 'votes' => 1]          // Values to set
    );

// Increment / Decrement
DB::table('users')->where('id', 1)->increment('votes');
DB::table('users')->where('id', 1)->increment('votes', 5);
DB::table('users')->where('id', 1)->increment('votes', 1, ['name' => 'John']);
DB::table('users')->where('id', 1)->decrement('votes');
DB::table('users')->where('id', 1)->incrementEach([
    'votes' => 5,
    'balance' => 100,
]);

// Delete
DB::table('users')->where('votes', '<', 10)->delete();

// Truncate
DB::table('users')->truncate();
```

### 13.6 Raw Expressions

```php
// Raw select
DB::table('orders')
    ->select(DB::raw('DATE(created_at) as date, SUM(amount) as total'))
    ->groupBy('date')
    ->get();

// selectRaw
DB::table('orders')
    ->selectRaw('price * ? as price_with_tax', [1.0825])
    ->get();

// whereRaw
DB::table('orders')
    ->whereRaw('price > IF(state = "TX", ?, 100)', [200])
    ->get();

// havingRaw
DB::table('orders')
    ->select('department', DB::raw('SUM(price) as total'))
    ->groupBy('department')
    ->havingRaw('SUM(price) > ?', [2500])
    ->get();

// orderByRaw
DB::table('orders')
    ->orderByRaw('updated_at - created_at DESC')
    ->get();

// groupByRaw
DB::table('orders')
    ->selectRaw('city, state, count(*) as total')
    ->groupByRaw('city, state')
    ->get();
```

### 13.7 Transactions

```php
// Automatic transaction (retries on deadlock)
DB::transaction(function () {
    DB::table('users')->update(['votes' => 1]);
    DB::table('posts')->delete();
}, 5); // 5 retry attempts on deadlock

// Manual transaction
DB::beginTransaction();
try {
    DB::table('users')->update(['votes' => 1]);
    DB::table('posts')->delete();
    DB::commit();
} catch (\Exception $e) {
    DB::rollBack();
    throw $e;
}

// Savepoints
DB::transaction(function () {
    DB::table('users')->update(['votes' => 1]);

    DB::transaction(function () {
        // This creates a savepoint
        DB::table('posts')->delete();
    });
});
```

---

## 14. Eloquent ORM

### 14.1 Model Definition

```bash
php artisan make:model Product -m          # With migration
php artisan make:model Product -mfc        # Migration + factory + controller
php artisan make:model Product -mfcs       # Migration + factory + controller + seeder
php artisan make:model Product --all       # Migration, factory, seeder, policy, controller, form requests
```

```php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    // ── Table Configuration ────────────────
    protected $table = 'products';           // Custom table name (default: plural snake_case)
    protected $primaryKey = 'id';            // Custom primary key
    protected $keyType = 'int';              // Primary key type ('int' or 'string')
    public $incrementing = true;             // Auto-increment
    public $timestamps = true;               // created_at / updated_at
    protected $connection = 'mysql';         // Database connection
    protected $dateFormat = 'U';             // Custom date storage format

    const CREATED_AT = 'creation_date';      // Custom column names
    const UPDATED_AT = 'last_update';

    // ── Mass Assignment ────────────────────
    protected $fillable = [
        'name', 'slug', 'price', 'description',
        'category_id', 'status',
    ];
    // OR (inverse — less secure)
    // protected $guarded = ['id'];
    // protected $guarded = [];              // Allow everything (dangerous)

    // ── Hidden / Visible (serialization) ──
    protected $hidden = ['password', 'remember_token'];
    protected $visible = ['name', 'email'];

    // ── Attribute Casting ──────────────────
    protected $casts = [
        'price'            => 'decimal:2',
        'is_active'        => 'boolean',
        'options'          => 'array',          // JSON ↔ array
        'metadata'         => 'collection',     // JSON ↔ Collection
        'settings'         => 'object',         // JSON ↔ stdClass
        'published_at'     => 'datetime',
        'birthday'         => 'date',
        'secret'           => 'encrypted',      // Encrypted at rest
        'secret_array'     => 'encrypted:array',
        'status'           => ProductStatus::class,  // Enum cast (PHP 8.1)
        'address'          => AddressCast::class,    // Custom cast
    ];

    // ── Default Attribute Values ───────────
    protected $attributes = [
        'status'    => 'draft',
        'is_active' => true,
    ];

    // ── Eager Load by Default ──────────────
    protected $with = ['category'];

    // ── Default counts ─────────────────────
    protected $withCount = ['comments'];

    // ── Appended Attributes ────────────────
    protected $appends = ['formatted_price', 'is_on_sale'];

    // ── Relationships ──────────────────────
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class)
                    ->withTimestamps()
                    ->withPivot('order');
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    public function latestComment(): HasOne
    {
        return $this->hasOne(Comment::class)->latestOfMany();
    }

    // ── Accessors (Laravel 10+ syntax) ─────
    protected function formattedPrice(): Attribute
    {
        return Attribute::make(
            get: fn () => '$' . number_format($this->price, 2),
        );
    }

    protected function name(): Attribute
    {
        return Attribute::make(
            get: fn (string $value) => ucfirst($value),
            set: fn (string $value) => strtolower($value),
        );
    }

    protected function isOnSale(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->price < $this->original_price,
        )->shouldCache();
    }

    // ── Scopes ─────────────────────────────
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', 'active');
    }

    public function scopeExpensive(Builder $query, float $minPrice = 100): Builder
    {
        return $query->where('price', '>=', $minPrice);
    }

    public function scopeFilter(Builder $query, array $filters): Builder
    {
        return $query
            ->when($filters['status'] ?? null, fn($q, $s) => $q->where('status', $s))
            ->when($filters['min_price'] ?? null, fn($q, $p) => $q->where('price', '>=', $p))
            ->when($filters['search'] ?? null, fn($q, $s) => $q->where('name', 'like', "%{$s}%"));
    }

    // ── Model Events ──────────────────────
    protected static function booted(): void
    {
        static::creating(function (Product $product) {
            $product->slug = Str::slug($product->name);
        });

        static::deleting(function (Product $product) {
            $product->tags()->detach();
        });

        // Global scope
        static::addGlobalScope('active', function (Builder $builder) {
            $builder->where('is_active', true);
        });
    }
}
```

### 14.2 CRUD Operations

```php
// ── Create ────────────────────────────────
$product = Product::create([
    'name'  => 'Widget',
    'price' => 9.99,
]);

$product = new Product();
$product->name = 'Widget';
$product->price = 9.99;
$product->save();

// First or create
$product = Product::firstOrCreate(
    ['name' => 'Widget'],                    // Search criteria
    ['price' => 9.99, 'status' => 'active']  // Values if creating
);

// First or new (doesn't save)
$product = Product::firstOrNew(
    ['name' => 'Widget'],
    ['price' => 9.99]
);
$product->save(); // Manual save needed

// Update or create (upsert)
$product = Product::updateOrCreate(
    ['name' => 'Widget'],
    ['price' => 12.99]
);

// ── Read ──────────────────────────────────
$products = Product::all();
$product  = Product::find(1);
$product  = Product::findOrFail(1);                         // 404 if not found
$product  = Product::where('status', 'active')->first();
$product  = Product::where('status', 'active')->firstOrFail();
$products = Product::where('price', '>', 10)->get();

// Find multiple
$products = Product::find([1, 2, 3]);
$products = Product::findMany([1, 2, 3]);

// Find or instantiate/create
$product = Product::findOr(1, fn() => new Product(['name' => 'Default']));

// ── Update ────────────────────────────────
$product = Product::find(1);
$product->price = 12.99;
$product->save();

// Mass update
Product::where('status', 'draft')
       ->update(['status' => 'archived']);

// Fill (doesn't save)
$product->fill(['name' => 'New Name', 'price' => 5.99]);
$product->save();

// ── Delete ────────────────────────────────
$product = Product::find(1);
$product->delete();

Product::destroy(1);
Product::destroy([1, 2, 3]);
Product::where('status', 'archived')->delete();

// Soft delete operations
$product->trashed();                                        // Is soft-deleted?
Product::withTrashed()->get();                              // Include soft-deleted
Product::onlyTrashed()->get();                              // Only soft-deleted
$product->restore();                                        // Restore
$product->forceDelete();                                    // Permanent delete

// Prunable models (auto-delete old records)
use Illuminate\Database\Eloquent\Prunable;

class Order extends Model {
    use Prunable;

    public function prunable(): Builder {
        return static::where('created_at', '<=', now()->subMonths(6));
    }

    protected function pruning(): void {
        // Cleanup before prune (delete files, etc.)
        Storage::delete($this->receipt_path);
    }
}
// php artisan model:prune
```

### 14.3 Query Scopes

```php
// Local scopes
Product::active()->expensive(50)->get();
Product::filter($request->only(['status', 'min_price', 'search']))->paginate(20);

// Global scopes
// Applied automatically to all queries on the model

// Define as a class
namespace App\Models\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

class ActiveScope implements Scope
{
    public function apply(Builder $builder, Model $model): void
    {
        $builder->where('is_active', true);
    }
}

// Register in model
protected static function booted(): void
{
    static::addGlobalScope(new ActiveScope);
}

// Remove global scope for specific query
Product::withoutGlobalScope(ActiveScope::class)->get();
Product::withoutGlobalScopes()->get();                    // Remove ALL
Product::withoutGlobalScopes([ActiveScope::class])->get();
```

### 14.4 Enum Casting (PHP 8.1+)

```php
// app/Enums/ProductStatus.php
enum ProductStatus: string
{
    case Draft     = 'draft';
    case Active    = 'active';
    case Archived  = 'archived';
}

// In the model
protected $casts = [
    'status' => ProductStatus::class,
];

// Usage
$product->status = ProductStatus::Active;
$product->save();

if ($product->status === ProductStatus::Active) {
    // ...
}

// Query
Product::where('status', ProductStatus::Active)->get();
```

### 14.5 Custom Casts

```php
namespace App\Casts;

use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;
use App\ValueObjects\Address;

class AddressCast implements CastsAttributes
{
    public function get(Model $model, string $key, mixed $value, array $attributes): Address
    {
        $data = json_decode($value, true);
        return new Address(
            street: $data['street'],
            city: $data['city'],
            state: $data['state'],
            zip: $data['zip'],
        );
    }

    public function set(Model $model, string $key, mixed $value, array $attributes): string
    {
        return json_encode([
            'street' => $value->street,
            'city'   => $value->city,
            'state'  => $value->state,
            'zip'    => $value->zip,
        ]);
    }
}

// Usage in model
protected $casts = [
    'address' => AddressCast::class,
];
```

### 14.6 Model Factories & Seeders

```bash
php artisan make:factory ProductFactory
php artisan make:seeder ProductSeeder
```

```php
// database/factories/ProductFactory.php
namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name'        => fake()->words(3, true),
            'slug'        => fake()->unique()->slug(),
            'price'       => fake()->randomFloat(2, 1, 999),
            'description' => fake()->paragraphs(3, true),
            'status'      => fake()->randomElement(['active', 'draft']),
            'category_id' => Category::factory(),          // Create related
            'is_active'   => true,
        ];
    }

    // State methods
    public function active(): static
    {
        return $this->state(fn(array $attributes) => [
            'status' => 'active',
        ]);
    }

    public function expensive(): static
    {
        return $this->state(fn(array $attributes) => [
            'price' => fake()->randomFloat(2, 500, 9999),
        ]);
    }

    public function withComments(int $count = 3): static
    {
        return $this->has(Comment::factory()->count($count));
    }

    // After creating hook
    public function configure(): static
    {
        return $this->afterCreating(function (Product $product) {
            $product->tags()->attach(Tag::factory()->count(2)->create());
        });
    }
}

// Usage
Product::factory()->create();                          // Single, persisted
Product::factory()->make();                            // Single, not persisted
Product::factory()->count(10)->create();               // Multiple
Product::factory()->active()->expensive()->create();   // With states
Product::factory()->for(Category::factory())->create();// With parent
Product::factory()->has(Comment::factory()->count(3))->create(); // With children

// Sequences
Product::factory()
    ->count(4)
    ->sequence(
        ['status' => 'active'],
        ['status' => 'draft'],
    )
    ->create();

// database/seeders/ProductSeeder.php
class ProductSeeder extends Seeder
{
    public function run(): void
    {
        Product::factory()
            ->count(50)
            ->active()
            ->has(Comment::factory()->count(3))
            ->create();
    }
}

// database/seeders/DatabaseSeeder.php
class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            CategorySeeder::class,
            ProductSeeder::class,
            UserSeeder::class,
        ]);
    }
}
```

```bash
php artisan db:seed
php artisan db:seed --class=ProductSeeder
php artisan migrate:fresh --seed
```

---

## 15. Eloquent Relationships

### 15.1 One to One

```php
// User has one Phone
class User extends Model {
    public function phone(): HasOne {
        return $this->hasOne(Phone::class);
        // return $this->hasOne(Phone::class, 'foreign_key', 'local_key');
    }
}

// Phone belongs to User
class Phone extends Model {
    public function user(): BelongsTo {
        return $this->belongsTo(User::class);
    }
}

// Usage
$phone = User::find(1)->phone;
$user  = Phone::find(1)->user;

// One of Many
class User extends Model {
    public function latestOrder(): HasOne {
        return $this->hasOne(Order::class)->latestOfMany();
    }

    public function oldestOrder(): HasOne {
        return $this->hasOne(Order::class)->oldestOfMany();
    }

    public function largestOrder(): HasOne {
        return $this->hasOne(Order::class)->ofMany('price', 'max');
    }
}
```

### 15.2 One to Many

```php
// Post has many Comments
class Post extends Model {
    public function comments(): HasMany {
        return $this->hasMany(Comment::class);
    }
}

// Comment belongs to Post
class Comment extends Model {
    public function post(): BelongsTo {
        return $this->belongsTo(Post::class);
    }
}

// Usage
$comments = Post::find(1)->comments;        // Collection
$post     = Comment::find(1)->post;         // Single model

// Create through relationship
$post->comments()->create(['body' => 'Great post!']);
$post->comments()->createMany([
    ['body' => 'Comment 1'],
    ['body' => 'Comment 2'],
]);

// Associate / Dissociate (for belongsTo)
$comment->post()->associate($post);
$comment->save();

$comment->post()->dissociate();
$comment->save();
```

### 15.3 Many to Many

```php
// User has many Roles, Role has many Users
// Pivot table: role_user (alphabetical order)

class User extends Model {
    public function roles(): BelongsToMany {
        return $this->belongsToMany(Role::class)
            ->withTimestamps()                     // created_at, updated_at on pivot
            ->withPivot('assigned_by', 'expires_at') // Extra pivot columns
            ->wherePivot('active', true)           // Filter pivot
            ->as('assignment');                     // Rename pivot accessor
    }
}

class Role extends Model {
    public function users(): BelongsToMany {
        return $this->belongsToMany(User::class);
    }
}

// Usage
$roles = $user->roles;
$user->roles->each(function ($role) {
    echo $role->pivot->created_at;          // Access pivot data
    echo $role->assignment->expires_at;     // If renamed with ->as()
});

// Attaching / Detaching
$user->roles()->attach($roleId);
$user->roles()->attach($roleId, ['assigned_by' => auth()->id()]);
$user->roles()->attach([1, 2, 3]);
$user->roles()->attach([
    1 => ['assigned_by' => 'admin'],
    2 => ['assigned_by' => 'system'],
]);

$user->roles()->detach($roleId);
$user->roles()->detach([1, 2, 3]);
$user->roles()->detach();                   // Detach ALL

// Sync (replace all with these)
$user->roles()->sync([1, 2, 3]);
$user->roles()->sync([
    1 => ['expires_at' => now()->addYear()],
    2 => ['expires_at' => now()->addMonth()],
]);

// Sync without detaching
$user->roles()->syncWithoutDetaching([1, 2, 3]);

// Sync with pivot values
$user->roles()->syncWithPivotValues([1, 2, 3], ['active' => true]);

// Toggle (attach if missing, detach if present)
$user->roles()->toggle([1, 2, 3]);

// Update pivot
$user->roles()->updateExistingPivot($roleId, ['active' => false]);
```

### 15.4 Has Many Through

```php
// Country → Users → Posts
// Access posts through users

class Country extends Model {
    public function posts(): HasManyThrough {
        return $this->hasManyThrough(
            Post::class,     // Final model
            User::class,     // Intermediate model
            'country_id',    // FK on intermediate (users.country_id)
            'user_id',       // FK on final (posts.user_id)
            'id',            // Local key on Country
            'id',            // Local key on User
        );
    }
}

// Has One Through
class Mechanic extends Model {
    public function carOwner(): HasOneThrough {
        return $this->hasOneThrough(Owner::class, Car::class);
    }
}
```

### 15.5 Polymorphic Relationships

```php
// ── One to One (Morphs) ───────────────────
// Image can belong to User OR Post
// images table: imageable_id, imageable_type

class Image extends Model {
    public function imageable(): MorphTo {
        return $this->morphTo();
    }
}

class User extends Model {
    public function image(): MorphOne {
        return $this->morphOne(Image::class, 'imageable');
    }
}

class Post extends Model {
    public function image(): MorphOne {
        return $this->morphOne(Image::class, 'imageable');
    }
}


// ── One to Many (Morphs) ──────────────────
// Comment can belong to Post OR Video
// comments table: commentable_id, commentable_type

class Comment extends Model {
    public function commentable(): MorphTo {
        return $this->morphTo();
    }
}

class Post extends Model {
    public function comments(): MorphMany {
        return $this->morphMany(Comment::class, 'commentable');
    }
}

class Video extends Model {
    public function comments(): MorphMany {
        return $this->morphMany(Comment::class, 'commentable');
    }
}


// ── Many to Many (Morphs) ─────────────────
// Tags can be on Posts, Videos, etc.
// taggables table: tag_id, taggable_id, taggable_type

class Tag extends Model {
    public function posts(): MorphToMany {
        return $this->morphedByMany(Post::class, 'taggable');
    }
    public function videos(): MorphToMany {
        return $this->morphedByMany(Video::class, 'taggable');
    }
}

class Post extends Model {
    public function tags(): MorphToMany {
        return $this->morphToMany(Tag::class, 'taggable');
    }
}


// ── Morph Map (use short names instead of FQCN) ──
// In AppServiceProvider boot()
use Illuminate\Database\Eloquent\Relations\Relation;

Relation::enforceMorphMap([
    'post'  => Post::class,
    'video' => Video::class,
    'user'  => User::class,
]);
```

### 15.6 Eager Loading

```php
// N+1 Problem:
$posts = Post::all();                       // 1 query
foreach ($posts as $post) {
    echo $post->author->name;               // N queries!
}

// Eager loading solution:
$posts = Post::with('author')->get();       // 2 queries total

// Multiple relationships
$posts = Post::with(['author', 'comments'])->get();

// Nested eager loading
$posts = Post::with('author.profile')->get();
$posts = Post::with([
    'author.profile',
    'comments.user',
])->get();

// Constrained eager loading
$posts = Post::with([
    'comments' => function ($query) {
        $query->where('approved', true)
              ->orderBy('created_at', 'desc')
              ->limit(5);
    },
])->get();

// Eager loading specific columns
$posts = Post::with('author:id,name,email')->get();

// Lazy eager loading (after initial query)
$posts = Post::all();
$posts->load('author');
$posts->load(['author', 'comments']);

// Prevent lazy loading (detect N+1 in development)
// In AppServiceProvider boot()
Model::preventLazyLoading(! app()->isProduction());

// With count
$posts = Post::withCount('comments')->get();
echo $posts[0]->comments_count;

// With sum/min/max/avg
$posts = Post::withSum('comments', 'votes')->get();
echo $posts[0]->comments_sum_votes;

$posts = Post::withAvg('reviews', 'rating')->get();
echo $posts[0]->reviews_avg_rating;

// With existence check
$posts = Post::withExists('comments')->get();
if ($posts[0]->comments_exists) { /* ... */ }

// Conditional eager loading
$posts = Post::when($includeComments, fn($q) => $q->with('comments'))->get();

// Morphs eager loading
$comments = Comment::with('commentable')->get();
```

---

## 16. Eloquent Collections

### 16.1 Common Collection Methods

```php
$products = Product::all(); // Returns Eloquent Collection

// ── Filtering ─────────────────────────────
$active    = $products->where('status', 'active');
$expensive = $products->where('price', '>', 100);
$filtered  = $products->filter(fn($p) => $p->price > 50 && $p->is_active);
$first     = $products->first(fn($p) => $p->price > 100);
$last      = $products->last(fn($p) => $p->price > 100);
$unique    = $products->unique('category_id');
$rejected  = $products->reject(fn($p) => $p->is_archived);

// ── Transforming ──────────────────────────
$names   = $products->map(fn($p) => $p->name);
$flat    = $products->flatMap(fn($p) => $p->tags->pluck('name'));
$plucked = $products->pluck('name');                  // Collection of names
$plucked = $products->pluck('name', 'id');            // ['1' => 'Widget', ...]
$mapped  = $products->mapWithKeys(fn($p) => [$p->slug => $p->name]);

// ── Aggregating ───────────────────────────
$total   = $products->sum('price');
$average = $products->avg('price');
$max     = $products->max('price');
$min     = $products->min('price');
$count   = $products->count();
$median  = $products->median('price');

// ── Grouping ──────────────────────────────
$grouped = $products->groupBy('category_id');
$grouped = $products->groupBy(fn($p) => $p->created_at->format('Y-m'));

// ── Sorting ───────────────────────────────
$sorted = $products->sortBy('price');
$sorted = $products->sortByDesc('price');
$sorted = $products->sortBy([
    ['price', 'asc'],
    ['name', 'asc'],
]);

// ── Chunking / Partitioning ───────────────
$chunks = $products->chunk(10);                       // Groups of 10
[$active, $inactive] = $products->partition(fn($p) => $p->is_active);

// ── Checking ──────────────────────────────
$products->contains(fn($p) => $p->price > 1000);     // true/false
$products->contains('name', 'Widget');
$products->every(fn($p) => $p->price > 0);           // All match?
$products->isEmpty();
$products->isNotEmpty();

// ── Reducing ──────────────────────────────
$total = $products->reduce(fn($carry, $p) => $carry + $p->price, 0);

// ── Pagination ────────────────────────────
$products = Product::paginate(15);
$products = Product::simplePaginate(15);              // No total count (faster)
$products = Product::cursorPaginate(15);              // Cursor-based (most efficient)

// In Blade
{{ $products->links() }}                              // Pagination links
{{ $products->onEachSide(2)->links() }}
```

### 16.2 Eloquent-Specific Collection Methods

```php
// Model keys
$ids = $products->modelKeys();                        // [1, 2, 3, ...]

// Find by key
$product = $products->find(1);

// Load relationships
$products->load('category');
$products->loadMissing('category');

// Diff against other models
$diff = $products->diff(Product::where('status', 'archived')->get());

// Intersect
$common = $products->intersect(Product::where('featured', true)->get());

// Convert for frontend
$array  = $products->toArray();
$json   = $products->toJson();
$query  = $products->toQuery();                       // Back to query builder
```

---

## 17. Authentication

### 17.1 Setup with Starter Kits

```bash
# Laravel Breeze (simple — Blade, React, Vue, or API)
composer require laravel/breeze --dev
php artisan breeze:install
php artisan breeze:install vue        # With Vue
php artisan breeze:install react      # With React
php artisan breeze:install api        # API only (Sanctum)

# Laravel Jetstream (advanced — teams, 2FA, API tokens)
composer require laravel/jetstream
php artisan jetstream:install livewire
php artisan jetstream:install inertia

# Laravel Fortify (headless — backend only, no views)
composer require laravel/fortify
php artisan fortify:install

# Run after installation
npm install && npm run dev
php artisan migrate
```

### 17.2 Manual Authentication

```php
use Illuminate\Support\Facades\Auth;

// Attempt login
if (Auth::attempt(['email' => $email, 'password' => $password])) {
    $request->session()->regenerate();
    return redirect()->intended('dashboard');
}

// With remember me
Auth::attempt($credentials, $remember = true);

// Additional conditions
Auth::attempt([
    'email'     => $email,
    'password'  => $password,
    'is_active' => true,               // Extra WHERE condition
]);

// Login a specific user
Auth::login($user);
Auth::login($user, remember: true);
Auth::loginUsingId(1);
Auth::loginUsingId(1, remember: true);

// Once (no session/cookie — for stateless)
Auth::once(['email' => $email, 'password' => $password]);

// Logout
Auth::logout();
$request->session()->invalidate();
$request->session()->regenerateToken();

// Logout from other devices
Auth::logoutOtherDevices($currentPassword);

// Check authentication status
Auth::check();                          // Is logged in?
Auth::guest();                          // Is guest?
Auth::id();                             // User ID or null
Auth::user();                           // User model or null

// Protecting routes
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', ...);
});

Route::get('/profile', ...)->middleware('auth');

// In controller
public function __construct()
{
    $this->middleware('auth');
    $this->middleware('auth')->only(['create', 'store']);
    $this->middleware('auth')->except(['index', 'show']);
}
```

### 17.3 Guards

```php
// config/auth.php
'guards' => [
    'web' => [
        'driver'   => 'session',
        'provider' => 'users',
    ],
    'api' => [
        'driver'   => 'sanctum', // or 'token'
        'provider' => 'users',
    ],
    'admin' => [
        'driver'   => 'session',
        'provider' => 'admins',
    ],
],

'providers' => [
    'users' => [
        'driver' => 'eloquent',
        'model'  => App\Models\User::class,
    ],
    'admins' => [
        'driver' => 'eloquent',
        'model'  => App\Models\Admin::class,
    ],
],

// Using specific guard
Auth::guard('admin')->attempt($credentials);
Auth::guard('admin')->user();

// In routes
Route::middleware('auth:admin')->group(function () {
    // Only admin guard
});
```

### 17.4 Laravel Sanctum (API Tokens & SPA)

```bash
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate
```

```php
// User model
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable {
    use HasApiTokens;
}

// Issue token
$token = $user->createToken('device-name');
$plainText = $token->plainTextToken;    // Send this to client

// With abilities (permissions)
$token = $user->createToken('device-name', ['posts:read', 'posts:write']);

// Protecting routes
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Check token abilities
if ($user->tokenCan('posts:write')) {
    // ...
}

// Middleware for abilities
Route::middleware(['auth:sanctum', 'ability:posts:write'])->group(...);
Route::middleware(['auth:sanctum', 'abilities:posts:read,posts:write'])->group(...);

// Revoke tokens
$user->tokens()->delete();                          // All tokens
$user->currentAccessToken()->delete();              // Current token
$user->tokens()->where('id', $tokenId)->delete();   // Specific token

// SPA authentication (cookie-based)
// 1. Set SANCTUM_STATEFUL_DOMAINS in .env
// 2. Add EnsureFrontendRequestsAreStateful middleware to API group
// 3. Frontend: call /sanctum/csrf-cookie first, then use cookies
```

### 17.5 Password Reset

```php
use Illuminate\Support\Facades\Password;

// Send reset link
$status = Password::sendResetLink(
    $request->only('email')
);

return $status === Password::RESET_LINK_SENT
    ? back()->with('status', __($status))
    : back()->withErrors(['email' => __($status)]);

// Reset password
$status = Password::reset(
    $request->only('email', 'password', 'password_confirmation', 'token'),
    function (User $user, string $password) {
        $user->forceFill([
            'password' => Hash::make($password),
        ])->setRememberToken(Str::random(60));
        $user->save();
        event(new PasswordReset($user));
    }
);
```

### 17.6 Email Verification

```php
// User model
class User extends Authenticatable implements MustVerifyEmail {
    use HasApiTokens, HasFactory, Notifiable;
}

// Routes
Route::get('/email/verify', [VerificationController::class, 'notice'])
    ->middleware('auth')
    ->name('verification.notice');

Route::get('/email/verify/{id}/{hash}', [VerificationController::class, 'verify'])
    ->middleware(['auth', 'signed'])
    ->name('verification.verify');

// Protecting routes
Route::middleware(['auth', 'verified'])->group(function () {
    // Only verified users
});
```

---

## 18. Authorization (Gates & Policies)

### 18.1 Gates

```php
// Define gates in AuthServiceProvider or AppServiceProvider
use Illuminate\Support\Facades\Gate;

// In boot()
Gate::define('update-post', function (User $user, Post $post) {
    return $user->id === $post->user_id;
});

Gate::define('admin-access', function (User $user) {
    return $user->is_admin;
});

// Using gates
if (Gate::allows('update-post', $post)) {
    // Authorized...
}

if (Gate::denies('update-post', $post)) {
    abort(403);
}

// Authorization response (with message)
Gate::define('update-post', function (User $user, Post $post) {
    return $user->id === $post->user_id
        ? Response::allow()
        : Response::deny('You do not own this post.');
});

// Authorize (throws exception if denied)
Gate::authorize('update-post', $post);

// Check any / all
Gate::any(['update-post', 'delete-post'], $post);
Gate::none(['update-post', 'delete-post'], $post);

// For specific user
Gate::forUser($anotherUser)->allows('update-post', $post);

// Before / After hooks
Gate::before(function (User $user, string $ability) {
    if ($user->isSuperAdmin()) {
        return true;  // Super admins can do anything
    }
});

Gate::after(function (User $user, string $ability, bool|null $result) {
    // Runs after gate check
});

// In Blade
@can('update-post', $post)
    <a href="{{ route('posts.edit', $post) }}">Edit</a>
@endcan

@cannot('update-post', $post)
    <p>You cannot edit this post.</p>
@endcannot

@canany(['update-post', 'delete-post'], $post)
    <div class="actions">...</div>
@endcanany
```

### 18.2 Policies

```bash
php artisan make:policy PostPolicy --model=Post
```

```php
namespace App\Policies;

use App\Models\Post;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class PostPolicy
{
    /**
     * Runs before any other policy method.
     */
    public function before(User $user, string $ability): bool|null
    {
        if ($user->isSuperAdmin()) {
            return true;
        }
        return null;  // Fall through to specific method
    }

    /**
     * Determine if the user can view any posts.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine if the user can view the post.
     */
    public function view(User $user, Post $post): bool
    {
        return $post->status === 'published' || $user->id === $post->user_id;
    }

    /**
     * Determine if the user can create posts.
     */
    public function create(User $user): bool
    {
        return $user->hasVerifiedEmail();
    }

    /**
     * Determine if the user can update the post.
     */
    public function update(User $user, Post $post): Response
    {
        return $user->id === $post->user_id
            ? Response::allow()
            : Response::deny('You do not own this post.');
    }

    /**
     * Determine if the user can delete the post.
     */
    public function delete(User $user, Post $post): bool
    {
        return $user->id === $post->user_id;
    }

    /**
     * Determine if the user can restore a soft-deleted post.
     */
    public function restore(User $user, Post $post): bool
    {
        return $user->id === $post->user_id;
    }

    /**
     * Determine if the user can permanently delete the post.
     */
    public function forceDelete(User $user, Post $post): bool
    {
        return $user->isSuperAdmin();
    }
}

// Register policy (auto-discovered if following naming convention)
// Manual registration in AuthServiceProvider:
protected $policies = [
    Post::class => PostPolicy::class,
];

// Using policies
// In controller
public function update(Request $request, Post $post)
{
    $this->authorize('update', $post);  // Throws 403 if denied
    // ...
}

public function create()
{
    $this->authorize('create', Post::class);
    // ...
}

// Via user model
$user->can('update', $post);
$user->cannot('update', $post);

// Via middleware
Route::put('/posts/{post}', [PostController::class, 'update'])
    ->middleware('can:update,post');

Route::post('/posts', [PostController::class, 'store'])
    ->middleware('can:create,App\Models\Post');

// In Form Requests
public function authorize(): bool
{
    return $this->user()->can('update', $this->route('post'));
}
```

---

## 19. Artisan Console

### 19.1 Common Commands

```bash
# ── Application ────────────────────────────
php artisan serve                    # Start dev server (port 8000)
php artisan serve --port=8080        # Custom port
php artisan key:generate             # Generate APP_KEY
php artisan env                      # Show current environment
php artisan about                    # Show app info
php artisan down                     # Maintenance mode
php artisan down --secret="bypass"   # With bypass token
php artisan down --render="errors::503"
php artisan up                       # Exit maintenance mode

# ── Generators ─────────────────────────────
php artisan make:model Product -mfcs       # Model + migration + factory + controller + seeder
php artisan make:controller ProductController --api
php artisan make:migration create_products_table
php artisan make:middleware CheckAge
php artisan make:request StoreProductRequest
php artisan make:resource ProductResource
php artisan make:rule Uppercase
php artisan make:event OrderPlaced
php artisan make:listener SendOrderConfirmation --event=OrderPlaced
php artisan make:job ProcessPodcast
php artisan make:mail OrderShipped
php artisan make:notification InvoicePaid
php artisan make:policy PostPolicy --model=Post
php artisan make:command SendEmails
php artisan make:provider PaymentServiceProvider
php artisan make:observer ProductObserver --model=Product
php artisan make:cast JsonCast
php artisan make:exception InvalidOrderException
php artisan make:enum OrderStatus             # Laravel 11

# ── Database ───────────────────────────────
php artisan migrate
php artisan migrate:status
php artisan migrate:rollback
php artisan migrate:fresh --seed
php artisan db:seed
php artisan db:show                  # Database info
php artisan db:table users           # Table info
php artisan schema:dump              # Dump schema to SQL

# ── Cache ──────────────────────────────────
php artisan cache:clear
php artisan config:cache / config:clear
php artisan route:cache / route:clear
php artisan view:cache / view:clear
php artisan event:cache / event:clear
php artisan optimize / optimize:clear

# ── Queue ──────────────────────────────────
php artisan queue:work
php artisan queue:work --tries=3 --timeout=90
php artisan queue:listen                     # Restarts on code change
php artisan queue:restart                    # Graceful restart
php artisan queue:failed                     # List failed jobs
php artisan queue:retry all                  # Retry failed
php artisan queue:flush                      # Delete all failed
php artisan queue:monitor redis:default      # Monitor queue size

# ── Scheduling ─────────────────────────────
php artisan schedule:run                     # Run due tasks
php artisan schedule:list                    # List scheduled tasks
php artisan schedule:work                    # Run scheduler locally
php artisan schedule:test                    # Test a scheduled command

# ── Debugging ──────────────────────────────
php artisan route:list                       # All registered routes
php artisan route:list --path=api            # Filter by path
php artisan route:list --name=admin          # Filter by name
php artisan model:show User                  # Model info
php artisan tinker                           # REPL
```

### 19.2 Custom Artisan Commands

```bash
php artisan make:command SendWeeklyReport
```

```php
namespace App\Console\Commands;

use Illuminate\Console\Command;

class SendWeeklyReport extends Command
{
    /**
     * The name and signature of the command.
     * {user}     — required argument
     * {user?}    — optional argument
     * {user=foo} — default value
     * {--queue}  — boolean option
     * {--Q|queue}— with shortcut
     * {--queue=} — option with value
     * {--queue=default} — with default
     * {--id=*}   — array option
     */
    protected $signature = 'report:send
                            {type : The type of report (daily/weekly/monthly)}
                            {--queue= : Queue connection to use}
                            {--recipients=* : Email recipients}
                            {--force : Force send even if already sent}';

    protected $description = 'Send scheduled reports to administrators';

    public function handle(): int
    {
        $type = $this->argument('type');
        $queue = $this->option('queue');
        $recipients = $this->option('recipients');
        $force = $this->option('force');

        // Output
        $this->info('Sending report...');
        $this->warn('This may take a while.');
        $this->error('Something went wrong!');
        $this->line('Plain text output');
        $this->newLine(2);

        // Interactive input
        $name = $this->ask('What is your name?');
        $password = $this->secret('Enter password');
        $confirmed = $this->confirm('Continue?', true);

        // Choice
        $color = $this->choice('Pick a color', ['red', 'green', 'blue'], 0);

        // Anticipate (autocomplete)
        $name = $this->anticipate('Name?', ['John', 'Jane', 'Bob']);

        // Progress bar
        $users = User::all();
        $this->withProgressBar($users, function (User $user) {
            // Process user
        });

        // Or manual progress bar
        $bar = $this->output->createProgressBar(count($users));
        $bar->start();
        foreach ($users as $user) {
            // Process...
            $bar->advance();
        }
        $bar->finish();
        $this->newLine();

        // Table output
        $this->table(
            ['Name', 'Email', 'Status'],
            User::all(['name', 'email', 'status'])->toArray()
        );

        // Call another command
        $this->call('cache:clear');
        $this->callSilently('cache:clear');

        // Return exit code
        return Command::SUCCESS;    // 0
        // return Command::FAILURE; // 1
        // return Command::INVALID; // 2
    }
}
```

```bash
# Run custom command
php artisan report:send weekly --queue=redis --recipients=admin@example.com --force
```

### 19.3 Closure Commands

```php
// routes/console.php
use Illuminate\Support\Facades\Artisan;

Artisan::command('mail:send {user}', function (string $user) {
    $this->info("Sending mail to {$user}...");
})->purpose('Send email to a user');

// Calling from code
Artisan::call('mail:send', ['user' => 'john@example.com']);
$output = Artisan::output();

// Queue an Artisan command
Artisan::queue('mail:send', ['user' => 'john@example.com']);
```

---

## 20. Events & Listeners

### 20.1 Defining Events

```bash
php artisan make:event OrderPlaced
```

```php
namespace App\Events;

use App\Models\Order;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class OrderPlaced
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public Order $order,
        public string $paymentMethod = 'card',
    ) {}
}
```

### 20.2 Creating Listeners

```bash
php artisan make:listener SendOrderConfirmation --event=OrderPlaced
```

```php
namespace App\Listeners;

use App\Events\OrderPlaced;
use App\Mail\OrderConfirmation;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;

class SendOrderConfirmation implements ShouldQueue  // Queueable
{
    use InteractsWithQueue;

    public string $queue = 'emails';           // Queue name
    public string $connection = 'redis';       // Queue connection
    public int $delay = 5;                     // Delay in seconds
    public int $tries = 3;                     // Max attempts
    public int $maxExceptions = 2;             // Max exceptions before failing
    public bool $afterCommit = true;           // Wait for DB transaction commit

    public function handle(OrderPlaced $event): void
    {
        Mail::to($event->order->user->email)
            ->send(new OrderConfirmation($event->order));
    }

    /**
     * Determine if the listener should be queued.
     */
    public function shouldQueue(OrderPlaced $event): bool
    {
        return $event->order->total > 0;
    }

    /**
     * Handle a job failure.
     */
    public function failed(OrderPlaced $event, \Throwable $exception): void
    {
        Log::error('Failed to send order confirmation', [
            'order_id' => $event->order->id,
            'error'    => $exception->getMessage(),
        ]);
    }
}
```

### 20.3 Registering Events & Listeners

```php
// ─── Laravel 10: EventServiceProvider ─────
protected $listen = [
    OrderPlaced::class => [
        SendOrderConfirmation::class,
        UpdateInventory::class,
        NotifyAdmins::class,
    ],
    PaymentReceived::class => [
        RecordPayment::class,
    ],
];

// Auto-discovery (enabled by default in EventServiceProvider)
public function shouldDiscoverEvents(): bool
{
    return true;
}

// ─── Laravel 11: Attribute-based ──────────
use Illuminate\Events\Attributes\ObservedBy;

// On listener class
#[\Illuminate\Events\Attributes\AsListener]
class SendOrderConfirmation
{
    public function handle(OrderPlaced $event): void { /* ... */ }
}
```

### 20.4 Dispatching Events

```php
// Dispatch
event(new OrderPlaced($order));

// Or using static method
OrderPlaced::dispatch($order);

// Dispatch if condition
OrderPlaced::dispatchIf($order->total > 0, $order);
OrderPlaced::dispatchUnless($order->isFraudulent(), $order);

// Dispatching from model events
class Order extends Model {
    protected $dispatchesEvents = [
        'created' => OrderPlaced::class,
        'updated' => OrderUpdated::class,
        'deleted' => OrderDeleted::class,
    ];
}
```

### 20.5 Model Observers

```bash
php artisan make:observer ProductObserver --model=Product
```

```php
namespace App\Observers;

use App\Models\Product;

class ProductObserver
{
    public function creating(Product $product): void
    {
        $product->slug = Str::slug($product->name);
    }

    public function created(Product $product): void
    {
        Cache::forget('products.featured');
    }

    public function updating(Product $product): void { /* ... */ }
    public function updated(Product $product): void { /* ... */ }
    public function saving(Product $product): void { /* ... */ }
    public function saved(Product $product): void { /* ... */ }
    public function deleting(Product $product): void { /* ... */ }
    public function deleted(Product $product): void { /* ... */ }
    public function restoring(Product $product): void { /* ... */ }
    public function restored(Product $product): void { /* ... */ }
    public function forceDeleting(Product $product): void { /* ... */ }
    public function forceDeleted(Product $product): void { /* ... */ }
    public function retrieved(Product $product): void { /* ... */ }
    public function replicating(Product $product): void { /* ... */ }
}

// Register observer
// In AppServiceProvider or via attribute on model:
#[ObservedBy(ProductObserver::class)]
class Product extends Model { /* ... */ }

// Or manually:
Product::observe(ProductObserver::class);

// Temporarily disable events
Product::withoutEvents(function () {
    Product::create([...]);  // No observer events fired
});
```

### 20.6 Event Subscribers

```php
namespace App\Listeners;

class OrderEventSubscriber
{
    public function handleOrderPlaced(OrderPlaced $event): void { /* ... */ }
    public function handleOrderShipped(OrderShipped $event): void { /* ... */ }

    public function subscribe(Dispatcher $events): array
    {
        return [
            OrderPlaced::class  => 'handleOrderPlaced',
            OrderShipped::class => 'handleOrderShipped',
        ];
    }
}

// Register in EventServiceProvider
protected $subscribe = [
    OrderEventSubscriber::class,
];
```

---

## 21. Queues & Jobs

### 21.1 Configuration

```env
QUEUE_CONNECTION=redis
# Options: sync, database, redis, beanstalkd, sqs, null
```

```bash
# Database queue driver setup
php artisan queue:table
php artisan migrate

# Failed jobs table
php artisan make:queue-failed-table   # Laravel 11
php artisan queue:failed-table        # Laravel 10
php artisan migrate
```

### 21.2 Creating Jobs

```bash
php artisan make:job ProcessPodcast
```

```php
namespace App\Jobs;

use App\Models\Podcast;
use App\Services\AudioProcessor;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\Middleware\RateLimited;
use Illuminate\Queue\Middleware\WithoutOverlapping;

class ProcessPodcast implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    // ── Configuration ──────────────────────
    public int $tries = 3;                    // Max attempts
    public int $maxExceptions = 2;            // Max exceptions before fail
    public int $timeout = 120;                // Seconds before timeout
    public int $backoff = 60;                 // Seconds between retries
    // public array $backoff = [30, 60, 120]; // Exponential backoff
    public bool $failOnTimeout = true;        // Fail if timeout
    public bool $deleteWhenMissingModels = true; // Delete if model gone
    public int $uniqueFor = 3600;             // Unique lock (seconds)

    public function __construct(
        public Podcast $podcast,
    ) {}

    /**
     * Determine the time at which the job should timeout.
     */
    public function retryUntil(): DateTime
    {
        return now()->addMinutes(30);
    }

    /**
     * Calculate the number of seconds to wait before retrying the job.
     */
    public function backoff(): array
    {
        return [30, 60, 120]; // Retry after 30s, 60s, 120s
    }

    /**
     * The unique ID of the job.
     */
    public function uniqueId(): string
    {
        return $this->podcast->id;
    }

    /**
     * Middleware for the job.
     */
    public function middleware(): array
    {
        return [
            new RateLimited('podcast-processing'),
            (new WithoutOverlapping($this->podcast->id))
                ->expireAfter(180)
                ->releaseAfter(60),
        ];
    }

    /**
     * Execute the job.
     */
    public function handle(AudioProcessor $processor): void
    {
        $processor->process($this->podcast);

        // Release back to queue for retry
        // $this->release(60);  // After 60 seconds

        // Delete from queue
        // $this->delete();

        // Fail the job
        // $this->fail(new \Exception('Processing failed'));
    }

    /**
     * Handle a job failure.
     */
    public function failed(?\Throwable $exception): void
    {
        Log::error('Podcast processing failed', [
            'podcast_id' => $this->podcast->id,
            'error'      => $exception->getMessage(),
        ]);

        // Notify admin...
    }
}
```

### 21.3 Dispatching Jobs

```php
use App\Jobs\ProcessPodcast;

// Basic dispatch
ProcessPodcast::dispatch($podcast);

// With delay
ProcessPodcast::dispatch($podcast)->delay(now()->addMinutes(10));

// To specific queue
ProcessPodcast::dispatch($podcast)->onQueue('processing');

// To specific connection
ProcessPodcast::dispatch($podcast)->onConnection('redis');

// Dispatch synchronously (bypass queue)
ProcessPodcast::dispatchSync($podcast);

// Dispatch after response is sent
ProcessPodcast::dispatchAfterResponse($podcast);

// Conditional dispatch
ProcessPodcast::dispatchIf($podcast->isReady(), $podcast);
ProcessPodcast::dispatchUnless($podcast->isProcessed(), $podcast);

// Chain jobs (run in sequence)
Bus::chain([
    new ProcessPodcast($podcast),
    new GenerateThumbnail($podcast),
    new NotifySubscribers($podcast),
])->onQueue('processing')->dispatch();

// Batch jobs (run in parallel with tracking)
Bus::batch([
    new ImportCsv($file1),
    new ImportCsv($file2),
    new ImportCsv($file3),
])
->then(function (Batch $batch) {
    // All jobs completed successfully
})
->catch(function (Batch $batch, \Throwable $e) {
    // A job failed
})
->finally(function (Batch $batch) {
    // All jobs finished (success or failure)
})
->allowFailures()
->name('CSV Import')
->onQueue('imports')
->dispatch();

// Check batch progress
$batch = Bus::findBatch($batchId);
$batch->totalJobs;
$batch->pendingJobs;
$batch->failedJobs;
$batch->progress();  // Percentage
$batch->finished();
$batch->cancel();
```

### 21.4 Running the Queue Worker

```bash
# Process jobs
php artisan queue:work
php artisan queue:work redis                      # Specific connection
php artisan queue:work --queue=high,default,low    # Priority queues
php artisan queue:work --tries=3                   # Max attempts
php artisan queue:work --timeout=60                # Timeout per job
php artisan queue:work --sleep=3                   # Sleep when empty
php artisan queue:work --max-jobs=1000             # Stop after N jobs
php artisan queue:work --max-time=3600             # Stop after N seconds
php artisan queue:work --memory=128                # Stop if memory exceeds MB
php artisan queue:work --stop-when-empty           # Stop when queue is empty
php artisan queue:work --rest=1                    # Rest between jobs (seconds)

# Listen mode (auto-restarts on code changes — slower)
php artisan queue:listen

# Restart workers gracefully
php artisan queue:restart

# Failed jobs
php artisan queue:failed                           # List failed
php artisan queue:retry <job-id>                   # Retry specific
php artisan queue:retry all                        # Retry all
php artisan queue:forget <job-id>                  # Delete failed
php artisan queue:flush                            # Delete all failed
php artisan queue:prune-failed --hours=48          # Prune old failed

# Monitoring
php artisan queue:monitor redis:default --max=100  # Alert if > 100 jobs
```

### 21.5 Job Middleware

```php
// Rate limiting
use Illuminate\Queue\Middleware\RateLimited;
use Illuminate\Cache\RateLimiting\Limit;

// In AppServiceProvider boot()
RateLimiter::for('api-calls', function ($job) {
    return Limit::perMinute(10);
});

// In job
public function middleware(): array
{
    return [new RateLimited('api-calls')];
}

// Prevent overlapping
use Illuminate\Queue\Middleware\WithoutOverlapping;

public function middleware(): array
{
    return [(new WithoutOverlapping($this->user->id))->releaseAfter(60)];
}

// Skip if already processed
use Illuminate\Queue\Middleware\SkipIfBatchCancelled;

public function middleware(): array
{
    return [new SkipIfBatchCancelled];
}

// Throttle exceptions
use Illuminate\Queue\Middleware\ThrottlesExceptions;

public function middleware(): array
{
    return [(new ThrottlesExceptions(10, 5))->backoff(5)];
    // Allow 10 exceptions per 5 minutes, then back off 5 minutes
}
```

---

## 22. Task Scheduling

### 22.1 Defining Schedules

```php
// app/Console/Kernel.php (Laravel 10)
protected function schedule(Schedule $schedule): void
{
    // Run artisan commands
    $schedule->command('report:send daily')->dailyAt('08:00');
    $schedule->command('cache:clear')->weekly();

    // Run closures
    $schedule->call(function () {
        DB::table('recent_users')->delete();
    })->daily();

    // Run external commands
    $schedule->exec('node /home/forge/script.js')->daily();

    // Queue jobs
    $schedule->job(new CleanupJob)->hourly();
    $schedule->job(new CleanupJob, 'cleanup-queue', 'redis')->hourly();
}

// Laravel 11 — routes/console.php
use Illuminate\Support\Facades\Schedule;

Schedule::command('report:send daily')->dailyAt('08:00');
Schedule::call(fn() => Cache::flush())->weekly();
```

### 22.2 Schedule Frequencies

```php
$schedule->command('...')->everySecond();           // Every second
$schedule->command('...')->everyTwoSeconds();       // Every 2 seconds
$schedule->command('...')->everyFiveSeconds();      // Every 5 seconds
$schedule->command('...')->everyTenSeconds();       // Every 10 seconds
$schedule->command('...')->everyFifteenSeconds();   // Every 15 seconds
$schedule->command('...')->everyTwentySeconds();    // Every 20 seconds
$schedule->command('...')->everyThirtySeconds();    // Every 30 seconds
$schedule->command('...')->everyMinute();           // Every minute
$schedule->command('...')->everyTwoMinutes();       // Every 2 minutes
$schedule->command('...')->everyThreeMinutes();     // Every 3 minutes
$schedule->command('...')->everyFourMinutes();      // Every 4 minutes
$schedule->command('...')->everyFiveMinutes();      // Every 5 minutes
$schedule->command('...')->everyTenMinutes();       // Every 10 minutes
$schedule->command('...')->everyFifteenMinutes();   // Every 15 minutes
$schedule->command('...')->everyThirtyMinutes();    // Every 30 minutes
$schedule->command('...')->hourly();
$schedule->command('...')->hourlyAt(17);            // At :17 past the hour
$schedule->command('...')->everyOddHour();
$schedule->command('...')->everyTwoHours();
$schedule->command('...')->daily();
$schedule->command('...')->dailyAt('13:00');
$schedule->command('...')->twiceDaily(1, 13);       // At 1:00 and 13:00
$schedule->command('...')->twiceDailyAt(1, 13, 15); // At 1:15 and 13:15
$schedule->command('...')->weekly();
$schedule->command('...')->weeklyOn(1, '8:00');     // Monday at 8:00
$schedule->command('...')->monthly();
$schedule->command('...')->monthlyOn(4, '15:00');   // 4th of month at 15:00
$schedule->command('...')->quarterly();
$schedule->command('...')->yearly();
$schedule->command('...')->yearlyOn(6, 1, '17:00'); // June 1st at 17:00

// Custom cron
$schedule->command('...')->cron('0 */6 * * *');     // Every 6 hours

// Day constraints
$schedule->command('...')->weekdays();
$schedule->command('...')->weekends();
$schedule->command('...')->sundays();
$schedule->command('...')->mondays();
$schedule->command('...')->tuesdays();
// ... etc

// Conditional
$schedule->command('...')->daily()->when(function () {
    return true; // Only if this returns true
});
$schedule->command('...')->daily()->skip(function () {
    return false; // Skip if this returns true
});
$schedule->command('...')->daily()->environments(['production']);

// Prevent overlapping
$schedule->command('...')->withoutOverlapping();
$schedule->command('...')->withoutOverlapping(10); // Lock for 10 minutes

// Run on one server (for multi-server deployments)
$schedule->command('...')->onOneServer();

// Background
$schedule->command('...')->runInBackground();

// Maintenance mode
$schedule->command('...')->evenInMaintenanceMode();

// Output
$schedule->command('...')->sendOutputTo('/path/to/output.log');
$schedule->command('...')->appendOutputTo('/path/to/output.log');
$schedule->command('...')->emailOutputTo('admin@example.com');
$schedule->command('...')->emailOutputOnFailure('admin@example.com');

// Hooks
$schedule->command('...')
    ->before(function () { /* Before task */ })
    ->after(function () { /* After task */ })
    ->onSuccess(function () { /* On success */ })
    ->onFailure(function () { /* On failure */ })
    ->pingBefore('https://heartbeat.example.com/start')
    ->thenPing('https://heartbeat.example.com/done')
    ->pingOnSuccess('https://heartbeat.example.com/success')
    ->pingOnFailure('https://heartbeat.example.com/failure');
```

### 22.3 Running the Scheduler

```bash
# Crontab entry (on server)
* * * * * cd /path-to-your-project && php artisan schedule:run >> /dev/null 2>&1

# Local development
php artisan schedule:work    # Runs scheduler every minute
```

---

## 23. Mail

### 23.1 Configuration

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_username
MAIL_PASSWORD=your_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="${APP_NAME}"
```

### 23.2 Creating Mailables

```bash
php artisan make:mail OrderShipped --markdown=emails.orders.shipped
```

```php
namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Queue\SerializesModels;

class OrderShipped extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public Order $order,
    ) {}

    /**
     * The envelope (from, subject, etc.)
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            from: new Address('noreply@example.com', 'My App'),
            replyTo: [
                new Address('support@example.com', 'Support'),
            ],
            subject: 'Order Shipped — #' . $this->order->id,
            tags: ['order', 'shipping'],
            metadata: [
                'order_id' => $this->order->id,
            ],
        );
    }

    /**
     * Content definition
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'emails.orders.shipped',  // or view: for blade
            with: [
                'orderUrl' => route('orders.show', $this->order),
                'trackingNumber' => $this->order->tracking_number,
            ],
        );
    }

    /**
     * Attachments
     */
    public function attachments(): array
    {
        return [
            Attachment::fromPath('/path/to/invoice.pdf')
                ->as('invoice.pdf')
                ->withMime('application/pdf'),

            Attachment::fromStorage('invoices/order-' . $this->order->id . '.pdf'),

            Attachment::fromData(
                fn () => $this->order->generatePdf(),
                'invoice.pdf'
            ),
        ];
    }

    /**
     * Custom headers
     */
    public function headers(): Headers
    {
        return new Headers(
            messageId: 'order-' . $this->order->id . '@example.com',
            text: [
                'X-Custom-Header' => 'Custom Value',
            ],
        );
    }
}
```

### 23.3 Markdown Email Template

```blade
{{-- resources/views/emails/orders/shipped.blade.php --}}
<x-mail::message>
# Order Shipped!

Your order **#{{ $order->id }}** has been shipped.

**Tracking Number:** {{ $trackingNumber }}

<x-mail::table>
| Item | Quantity | Price |
|:-----|:--------:|------:|
@foreach($order->items as $item)
| {{ $item->name }} | {{ $item->quantity }} | ${{ $item->price }} |
@endforeach
| **Total** | | **${{ $order->total }}** |
</x-mail::table>

<x-mail::button :url="$orderUrl" color="primary">
    Track Your Order
</x-mail::button>

<x-mail::panel>
    If you have any questions, reply to this email or contact our support team.
</x-mail::panel>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
```

### 23.4 Sending Mail

```php
use Illuminate\Support\Facades\Mail;
use App\Mail\OrderShipped;

// Send immediately
Mail::to($user)->send(new OrderShipped($order));

// Send to multiple recipients
Mail::to($user)
    ->cc($ccUsers)
    ->bcc($bccUsers)
    ->send(new OrderShipped($order));

// Queue for later sending
Mail::to($user)->queue(new OrderShipped($order));
Mail::to($user)->later(now()->addMinutes(10), new OrderShipped($order));

// To specific queue
Mail::to($user)
    ->onQueue('emails')
    ->queue(new OrderShipped($order));

// Using string address
Mail::to('john@example.com')->send(new OrderShipped($order));
Mail::to([
    'john@example.com',
    new Address('jane@example.com', 'Jane'),
])->send(new OrderShipped($order));

// Preview in browser (for testing)
Route::get('/mailable', function () {
    $order = Order::factory()->create();
    return new OrderShipped($order);
});
```

---

## 24. Notifications

### 24.1 Creating Notifications

```bash
php artisan make:notification InvoicePaid
```

```php
namespace App\Notifications;

use App\Models\Invoice;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Messages\SlackMessage;
use Illuminate\Notifications\Messages\DatabaseMessage;

class InvoicePaid extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Invoice $invoice,
    ) {}

    /**
     * Determine channels per notifiable.
     */
    public function via(object $notifiable): array
    {
        return $notifiable->prefers_sms
            ? ['vonage']
            : ['mail', 'database', 'slack'];
    }

    /**
     * Mail channel
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Invoice Paid — #' . $this->invoice->id)
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line('Invoice #' . $this->invoice->id . ' has been paid.')
            ->line('Amount: $' . number_format($this->invoice->amount, 2))
            ->action('View Invoice', url('/invoices/' . $this->invoice->id))
            ->line('Thank you for your business!')
            ->salutation('Best regards, My App Team');
    }

    /**
     * Database channel
     */
    public function toDatabase(object $notifiable): array
    {
        return [
            'invoice_id' => $this->invoice->id,
            'amount'     => $this->invoice->amount,
            'message'    => 'Invoice #' . $this->invoice->id . ' paid.',
        ];
    }

    /**
     * Slack channel
     */
    public function toSlack(object $notifiable): SlackMessage
    {
        return (new SlackMessage)
            ->success()
            ->content('Invoice #' . $this->invoice->id . ' was paid!')
            ->attachment(function ($attachment) {
                $attachment->title('Invoice #' . $this->invoice->id)
                           ->fields([
                               'Amount' => '$' . $this->invoice->amount,
                               'Customer' => $this->invoice->customer->name,
                           ]);
            });
    }

    /**
     * Custom channel representation type
     */
    public function toArray(object $notifiable): array
    {
        return [
            'invoice_id' => $this->invoice->id,
            'amount'     => $this->invoice->amount,
        ];
    }
}
```

### 24.2 Sending Notifications

```php
use Illuminate\Support\Facades\Notification;

// Via the Notifiable trait (on User model)
$user->notify(new InvoicePaid($invoice));

// Via the Notification facade (to multiple users)
Notification::send($users, new InvoicePaid($invoice));

// On-demand notification (no model needed)
Notification::route('mail', 'admin@example.com')
    ->route('slack', '#payments')
    ->notify(new InvoicePaid($invoice));
```

### 24.3 Database Notifications

```bash
php artisan notifications:table
php artisan migrate
```

```php
// User model
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable {
    use Notifiable;
}

// Read notifications
$notifications = $user->notifications;             // All
$unread        = $user->unreadNotifications;        // Unread
$read          = $user->readNotifications;          // Read

// Mark as read
$user->unreadNotifications->markAsRead();
$notification->markAsRead();

// Mark as unread
$notification->markAsUnread();

// Delete
$user->notifications()->delete();

// Access data
foreach ($user->unreadNotifications as $notification) {
    echo $notification->type;         // App\Notifications\InvoicePaid
    echo $notification->data['amount']; // Data from toDatabase()
    echo $notification->read_at;      // null if unread
    echo $notification->created_at;
}
```

---

## 25. File Storage

### 25.1 Configuration

```php
// config/filesystems.php
'disks' => [
    'local' => [
        'driver' => 'local',
        'root'   => storage_path('app'),
    ],
    'public' => [
        'driver'     => 'local',
        'root'       => storage_path('app/public'),
        'url'        => env('APP_URL').'/storage',
        'visibility' => 'public',
    ],
    's3' => [
        'driver'                  => 's3',
        'key'                     => env('AWS_ACCESS_KEY_ID'),
        'secret'                  => env('AWS_SECRET_ACCESS_KEY'),
        'region'                  => env('AWS_DEFAULT_REGION'),
        'bucket'                  => env('AWS_BUCKET'),
        'url'                     => env('AWS_URL'),
        'endpoint'                => env('AWS_ENDPOINT'),
        'use_path_style_endpoint' => env('AWS_USE_PATH_STYLE_ENDPOINT', false),
    ],
],
```

```bash
# Create symbolic link for public storage
php artisan storage:link
# Creates: public/storage → storage/app/public
```

### 25.2 Usage

```php
use Illuminate\Support\Facades\Storage;

// ── Write ─────────────────────────────────
Storage::put('file.txt', 'Contents');
Storage::put('file.txt', $resource);                    // Stream
Storage::putFile('photos', $request->file('photo'));     // Auto filename
Storage::putFileAs('photos', $file, 'custom-name.jpg');
Storage::disk('s3')->put('file.txt', 'Contents');
Storage::prepend('file.log', 'Prepended text');
Storage::append('file.log', 'Appended text');

// Visibility
Storage::put('file.jpg', $contents, 'public');
Storage::setVisibility('file.jpg', 'public');
$visibility = Storage::getVisibility('file.jpg');

// ── Read ──────────────────────────────────
$contents = Storage::get('file.txt');
$exists   = Storage::exists('file.txt');
$missing  = Storage::missing('file.txt');
$url      = Storage::url('photos/image.jpg');
$tempUrl  = Storage::temporaryUrl('file.jpg', now()->addMinutes(5)); // S3
$path     = Storage::path('file.txt');                   // Full filesystem path
$size     = Storage::size('file.txt');                    // Bytes
$lastMod  = Storage::lastModified('file.txt');            // Unix timestamp

// ── Download & Stream ─────────────────────
return Storage::download('file.pdf');
return Storage::download('file.pdf', 'custom-name.pdf');
return Storage::response('photo.jpg');                   // Inline display

// ── Delete ────────────────────────────────
Storage::delete('file.txt');
Storage::delete(['file1.txt', 'file2.txt']);

// ── Directories ───────────────────────────
$files       = Storage::files('photos');                  // Files in directory
$allFiles    = Storage::allFiles('photos');               // Recursive
$directories = Storage::directories('/');                 // Subdirectories
$allDirs     = Storage::allDirectories('/');              // Recursive
Storage::makeDirectory('photos/summer');
Storage::deleteDirectory('photos/summer');

// ── Copy & Move ───────────────────────────
Storage::copy('old/file.txt', 'new/file.txt');
Storage::move('old/file.txt', 'new/file.txt');

// ── Upload from Request ───────────────────
public function upload(Request $request)
{
    $request->validate([
        'photo' => 'required|image|max:2048',
    ]);

    $path = $request->file('photo')->store('photos', 'public');
    // Returns: photos/random-hash.jpg

    return Storage::url($path);
    // Returns: /storage/photos/random-hash.jpg
}
```

---

## 26. Caching

### 26.1 Configuration

```env
CACHE_DRIVER=redis
# Options: file, database, redis, memcached, dynamodb, array, null
```

### 26.2 Usage

```php
use Illuminate\Support\Facades\Cache;

// ── Basic Operations ──────────────────────
Cache::put('key', 'value', now()->addMinutes(10));   // TTL required
Cache::put('key', 'value', 600);                     // Seconds
Cache::forever('key', 'value');                       // No expiry
Cache::add('key', 'value', 600);                     // Only if not exists

$value = Cache::get('key');
$value = Cache::get('key', 'default');
$value = Cache::get('key', fn() => 'expensive-default');

Cache::forget('key');                                // Delete
Cache::flush();                                       // Clear all

// ── Remember (get or set) ─────────────────
$users = Cache::remember('users', 600, function () {
    return User::all();
});

$users = Cache::rememberForever('users', function () {
    return User::all();
});

// ── Pull (get and delete) ─────────────────
$value = Cache::pull('key');

// ── Increment / Decrement ─────────────────
Cache::increment('counter');
Cache::increment('counter', 5);
Cache::decrement('counter');

// ── Check existence ───────────────────────
Cache::has('key');
Cache::missing('key');

// ── Multiple keys ─────────────────────────
$values = Cache::many(['key1', 'key2', 'key3']);
Cache::putMany(['key1' => 'v1', 'key2' => 'v2'], 600);

// ── Tags (not supported by file/database) ─
Cache::tags(['people', 'artists'])->put('John', $john, 600);
Cache::tags(['people', 'authors'])->put('Anne', $anne, 600);

$john = Cache::tags(['people', 'artists'])->get('John');

Cache::tags(['people'])->flush();             // Flush by tag

// ── Atomic locks ──────────────────────────
$lock = Cache::lock('processing', 10);        // Lock for 10 seconds

if ($lock->get()) {
    try {
        // Process...
    } finally {
        $lock->release();
    }
}

// Block until lock is available
Cache::lock('processing', 10)->block(5, function () {
    // Acquired lock after waiting up to 5 seconds
});

// ── Cache store selection ─────────────────
Cache::store('redis')->get('key');
Cache::store('file')->put('key', 'value', 600);
```

### 26.3 HTTP Cache Headers

```php
// Cache control middleware
Route::middleware('cache.headers:public;max_age=2628000;etag')
    ->group(function () {
        Route::get('/assets/{file}', ...);
    });
```

---

## 27. Session

### 27.1 Configuration

```env
SESSION_DRIVER=redis
SESSION_LIFETIME=120    # Minutes
# Options: file, cookie, database, redis, memcached, dynamodb, array
```

### 27.2 Usage

```php
use Illuminate\Http\Request;

public function show(Request $request)
{
    // ── Retrieve ──────────────────────────
    $value = $request->session()->get('key');
    $value = $request->session()->get('key', 'default');
    $value = session('key');
    $value = session('key', 'default');
    $all   = $request->session()->all();

    // ── Check existence ───────────────────
    $request->session()->has('key');        // Present AND not null
    $request->session()->exists('key');     // Present (even if null)
    $request->session()->missing('key');    // Not present

    // ── Store ─────────────────────────────
    $request->session()->put('key', 'value');
    session(['key' => 'value']);

    // Push to array
    $request->session()->push('user.teams', 'developers');

    // Retrieve and delete
    $value = $request->session()->pull('key', 'default');

    // Increment / Decrement
    $request->session()->increment('count');
    $request->session()->increment('count', 5);
    $request->session()->decrement('count');

    // ── Delete ────────────────────────────
    $request->session()->forget('key');
    $request->session()->forget(['key1', 'key2']);
    $request->session()->flush();                   // Delete everything

    // ── Flash data (available only next request) ──
    $request->session()->flash('status', 'Profile updated!');
    $request->session()->reflash();                 // Keep for another request
    $request->session()->keep(['status']);           // Keep specific keys

    // ── Regenerate ID ─────────────────────
    $request->session()->regenerate();               // Keep data, new ID
    $request->session()->invalidate();               // Delete data + new ID
}
```

---

## 28. Logging

### 28.1 Configuration

```php
// config/logging.php
'channels' => [
    'stack' => [
        'driver'   => 'stack',
        'channels' => ['daily', 'slack'],    // Log to multiple channels
    ],
    'single' => [
        'driver' => 'single',
        'path'   => storage_path('logs/laravel.log'),
        'level'  => 'debug',
    ],
    'daily' => [
        'driver' => 'daily',
        'path'   => storage_path('logs/laravel.log'),
        'level'  => 'debug',
        'days'   => 14,                      // Retention
    ],
    'slack' => [
        'driver'   => 'slack',
        'url'      => env('LOG_SLACK_WEBHOOK_URL'),
        'username' => 'Laravel Log',
        'emoji'    => ':boom:',
        'level'    => 'critical',
    ],
    'stderr' => [
        'driver'  => 'monolog',
        'handler' => Monolog\Handler\StreamHandler::class,
        'with'    => ['stream' => 'php://stderr'],
    ],
],
```

### 28.2 Usage

```php
use Illuminate\Support\Facades\Log;

// Log levels (PSR-3)
Log::emergency('System is down!');
Log::alert('Action must be taken immediately.');
Log::critical('Critical condition.');
Log::error('Runtime error.', ['exception' => $e]);
Log::warning('Something needs attention.');
Log::notice('Normal but significant.');
Log::info('User logged in.', ['user_id' => $user->id]);
Log::debug('Variable value:', ['data' => $data]);

// With context
Log::info('User action', [
    'user_id'   => auth()->id(),
    'action'    => 'purchase',
    'amount'    => 99.99,
    'ip'        => request()->ip(),
]);

// Specific channel
Log::channel('slack')->critical('Server overload!');

// Build stack on-the-fly
Log::stack(['daily', 'slack'])->error('Something broke.');

// Contextual logging (shared context for all logs in request)
Log::withContext([
    'request_id' => (string) Str::uuid(),
    'user_id'    => auth()->id(),
]);

// Scoped context (for a block)
Log::shareContext(['correlation_id' => $corrId]);
```

---

## 29. Error Handling & Exceptions

### 29.1 Exception Handler

```php
// ─── Laravel 10: app/Exceptions/Handler.php ───
namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * Don't report these exceptions.
     */
    protected $dontReport = [
        \Illuminate\Auth\AuthenticationException::class,
        \Illuminate\Validation\ValidationException::class,
        \Symfony\Component\HttpKernel\Exception\HttpException::class,
    ];

    /**
     * Don't flash these inputs to session on validation errors.
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register exception handling callbacks.
     */
    public function register(): void
    {
        // Report specific exceptions
        $this->reportable(function (ExternalApiException $e) {
            Log::channel('external')->error($e->getMessage());
            return false; // Don't report via default logger too
        });

        // Render specific exceptions
        $this->renderable(function (NotFoundHttpException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'message' => 'Resource not found.',
                ], 404);
            }
        });

        // Stop propagation
        $this->stopIgnoring(ModelNotFoundException::class);
    }
}


// ─── Laravel 11: bootstrap/app.php ────────────
->withExceptions(function (Exceptions $exceptions) {
    $exceptions->dontReport([
        CustomException::class,
    ]);

    $exceptions->report(function (ExternalApiException $e) {
        Log::channel('external')->error($e->getMessage());
    });

    $exceptions->render(function (NotFoundHttpException $e, Request $request) {
        if ($request->is('api/*')) {
            return response()->json(['message' => 'Not found'], 404);
        }
    });
})
```

### 29.2 Custom Exceptions

```bash
php artisan make:exception InsufficientBalanceException
```

```php
namespace App\Exceptions;

use Exception;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class InsufficientBalanceException extends Exception
{
    public function __construct(
        public float $currentBalance,
        public float $requiredAmount,
    ) {
        parent::__construct("Insufficient balance: have {$currentBalance}, need {$requiredAmount}");
    }

    /**
     * Report the exception.
     */
    public function report(): void
    {
        Log::warning('Insufficient balance attempt', [
            'current'  => $this->currentBalance,
            'required' => $this->requiredAmount,
        ]);
    }

    /**
     * Render the exception as an HTTP response.
     */
    public function render(Request $request): Response
    {
        if ($request->expectsJson()) {
            return response()->json([
                'error'   => 'insufficient_balance',
                'current' => $this->currentBalance,
                'required' => $this->requiredAmount,
            ], 422);
        }

        return response()->view('errors.balance', [
            'current'  => $this->currentBalance,
            'required' => $this->requiredAmount,
        ], 422);
    }
}

// Usage
throw new InsufficientBalanceException(
    currentBalance: $user->balance,
    requiredAmount: $order->total
);
```

### 29.3 HTTP Exceptions

```php
// Abort helpers
abort(404);
abort(403, 'Forbidden');
abort_if(! $user->isAdmin(), 403, 'Access denied');
abort_unless($user->isAdmin(), 403);

// Custom error pages
// resources/views/errors/404.blade.php
// resources/views/errors/500.blade.php
// resources/views/errors/403.blade.php

// Publish Laravel's error pages
php artisan vendor:publish --tag=laravel-errors
```

---

## 30. Testing

### 30.1 Setup & Running

```bash
# Run all tests
php artisan test
php artisan test --parallel               # Parallel execution
php artisan test --filter=UserTest        # Specific test class
php artisan test --filter=test_user_can_login  # Specific method
php artisan test --testsuite=Feature      # Feature tests only
php artisan test --coverage               # With coverage

# PHPUnit directly
./vendor/bin/phpunit
```

### 30.2 Feature Tests (HTTP Tests)

```php
namespace Tests\Feature;

use App\Models\User;
use App\Models\Post;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class PostTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    public function test_user_can_view_posts(): void
    {
        $posts = Post::factory()->count(3)->create();

        $response = $this->get('/posts');

        $response->assertStatus(200);
        $response->assertViewIs('posts.index');
        $response->assertViewHas('posts');
        $response->assertSee($posts[0]->title);
    }

    public function test_authenticated_user_can_create_post(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/posts', [
            'title' => 'My Post',
            'body'  => 'Post content here',
        ]);

        $response->assertRedirect('/posts');
        $this->assertDatabaseHas('posts', [
            'title'   => 'My Post',
            'user_id' => $user->id,
        ]);
    }

    public function test_guest_cannot_create_post(): void
    {
        $response = $this->post('/posts', [
            'title' => 'My Post',
            'body'  => 'Content',
        ]);

        $response->assertRedirect('/login');
    }

    public function test_validation_errors(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/posts', [
            'title' => '',  // Required field
        ]);

        $response->assertSessionHasErrors(['title']);
        $response->assertInvalid(['title']);
    }

    public function test_user_can_delete_own_post(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)
                         ->delete("/posts/{$post->id}");

        $response->assertRedirect('/posts');
        $this->assertDatabaseMissing('posts', ['id' => $post->id]);
        // Or for soft deletes:
        $this->assertSoftDeleted('posts', ['id' => $post->id]);
    }
}
```

### 30.3 API Tests

```php
class ApiPostTest extends TestCase
{
    use RefreshDatabase;

    public function test_api_returns_posts(): void
    {
        $posts = Post::factory()->count(3)->create();

        $response = $this->getJson('/api/v1/posts');

        $response
            ->assertStatus(200)
            ->assertJsonCount(3, 'data')
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'title', 'slug', 'created_at'],
                ],
                'meta' => ['current_page', 'total'],
            ]);
    }

    public function test_api_create_post(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/v1/posts', [
                'title' => 'API Post',
                'body'  => 'Created via API',
            ]);

        $response
            ->assertStatus(201)
            ->assertJson([
                'data' => [
                    'title' => 'API Post',
                ],
            ]);
    }

    public function test_api_unauthorized(): void
    {
        $response = $this->getJson('/api/v1/posts');
        $response->assertUnauthorized();  // 401
    }
}
```

### 30.4 Common Assertions

```php
// ── Response Assertions ───────────────────
$response->assertStatus(200);
$response->assertOk();                         // 200
$response->assertCreated();                    // 201
$response->assertNoContent();                  // 204
$response->assertNotFound();                   // 404
$response->assertForbidden();                  // 403
$response->assertUnauthorized();               // 401
$response->assertUnprocessable();              // 422
$response->assertRedirect('/expected-url');
$response->assertRedirectToRoute('route.name');

// ── View Assertions ───────────────────────
$response->assertViewIs('view.name');
$response->assertViewHas('key');
$response->assertViewHas('key', 'value');
$response->assertViewMissing('key');

// ── JSON Assertions ──────────────────────
$response->assertJson(['key' => 'value']);
$response->assertExactJson([...]);
$response->assertJsonFragment(['key' => 'value']);
$response->assertJsonMissing(['key' => 'value']);
$response->assertJsonCount(3, 'data');
$response->assertJsonPath('data.0.name', 'John');
$response->assertJsonStructure(['data' => ['*' => ['id', 'name']]]);
$response->assertJsonIsArray('data');
$response->assertJsonIsObject('data');

// ── Session Assertions ───────────────────
$response->assertSessionHas('key');
$response->assertSessionHas('key', 'value');
$response->assertSessionHasErrors(['field']);
$response->assertSessionDoesntHaveErrors();
$response->assertSessionMissing('key');
$response->assertValid(['field']);
$response->assertInvalid(['field']);

// ── Content Assertions ───────────────────
$response->assertSee('text');
$response->assertSeeText('text');               // Without HTML tags
$response->assertDontSee('text');

// ── Cookie Assertions ────────────────────
$response->assertCookie('name');
$response->assertCookie('name', 'value');

// ── Header Assertions ────────────────────
$response->assertHeader('X-Custom', 'value');

// ── Database Assertions ──────────────────
$this->assertDatabaseHas('users', ['email' => 'john@example.com']);
$this->assertDatabaseMissing('users', ['email' => 'deleted@example.com']);
$this->assertDatabaseCount('users', 5);
$this->assertDatabaseEmpty('users');
$this->assertSoftDeleted('users', ['id' => 1]);
$this->assertNotSoftDeleted('users', ['id' => 1]);
$this->assertModelExists($user);
$this->assertModelMissing($user);

// ── Auth Assertions ──────────────────────
$this->assertAuthenticated();
$this->assertGuest();
$this->assertAuthenticatedAs($user);
```

### 30.5 Mocking

```php
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Http;

// Fake queues
Queue::fake();
// ... perform action ...
Queue::assertPushed(ProcessPodcast::class);
Queue::assertPushed(ProcessPodcast::class, function ($job) {
    return $job->podcast->id === 1;
});
Queue::assertNotPushed(AnotherJob::class);
Queue::assertCount(3);

// Fake mail
Mail::fake();
// ... perform action ...
Mail::assertSent(OrderShipped::class);
Mail::assertSent(OrderShipped::class, function ($mail) use ($user) {
    return $mail->hasTo($user->email);
});
Mail::assertNotSent(AnotherMail::class);
Mail::assertQueued(OrderShipped::class);

// Fake events
Event::fake();
// ... perform action ...
Event::assertDispatched(OrderPlaced::class);
Event::assertNotDispatched(OrderCancelled::class);

// Fake selective events
Event::fake([OrderPlaced::class]); // Only fake specific events

// Fake notifications
Notification::fake();
// ... perform action ...
Notification::assertSentTo($user, InvoicePaid::class);
Notification::assertNotSentTo($user, AnotherNotification::class);
Notification::assertCount(1);

// Fake storage
Storage::fake('photos');
// ... upload action ...
Storage::disk('photos')->assertExists('photo.jpg');
Storage::disk('photos')->assertMissing('missing.jpg');

// Fake HTTP
Http::fake([
    'github.com/*' => Http::response(['name' => 'laravel'], 200),
    '*'            => Http::response('Fallback', 500),
]);
// ... make HTTP requests ...
Http::assertSent(function ($request) {
    return $request->url() === 'https://github.com/api/repos';
});
Http::assertSentCount(2);

// Fake time
$this->freezeTime();
$this->travel(5)->minutes();
$this->travelTo(Carbon::create(2025, 1, 1, 12, 0, 0));
$this->travelBack();
```

### 30.6 Unit Tests

```php
namespace Tests\Unit;

use App\Services\PricingService;
use PHPUnit\Framework\TestCase;

class PricingServiceTest extends TestCase  // Note: PHPUnit TestCase, not Laravel
{
    public function test_calculates_discount(): void
    {
        $service = new PricingService();

        $result = $service->calculateDiscount(100, 10);

        $this->assertEquals(90, $result);
    }

    public function test_throws_for_negative_price(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('Price cannot be negative');

        $service = new PricingService();
        $service->calculateDiscount(-10, 5);
    }
}
```

---

## 31. API Resources

### 31.1 Creating Resources

```bash
php artisan make:resource UserResource
php artisan make:resource UserCollection
```

```php
namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'name'       => $this->name,
            'email'      => $this->email,
            'avatar_url' => $this->avatar_url,

            // Conditional attributes
            'email_verified' => $this->when($request->user()?->isAdmin(), $this->email_verified_at !== null),
            'secret_field'   => $this->when($this->isOwner($request->user()), $this->secret),

            // Conditional relationships
            'posts'    => PostResource::collection($this->whenLoaded('posts')),
            'profile'  => new ProfileResource($this->whenLoaded('profile')),

            // Conditional counts
            'posts_count' => $this->whenCounted('posts'),

            // Conditional aggregates
            'avg_rating' => $this->whenAggregated('reviews', 'rating', 'avg'),

            // Merge when condition
            $this->mergeWhen($request->user()?->isAdmin(), [
                'created_ip'  => $this->created_ip,
                'login_count' => $this->login_count,
            ]),

            // Pivot data
            'role' => $this->whenPivotLoaded('role_user', function () {
                return $this->pivot->role;
            }),

            // Dates
            'created_at' => $this->created_at->toIso8601String(),
            'updated_at' => $this->updated_at->toIso8601String(),

            // Links
            'links' => [
                'self'  => route('users.show', $this->id),
                'posts' => route('users.posts.index', $this->id),
            ],
        ];
    }

    /**
     * Additional metadata wrapped with the resource.
     */
    public function with(Request $request): array
    {
        return [
            'meta' => [
                'api_version' => '1.0',
            ],
        ];
    }
}
```

### 31.2 Resource Collections

```php
namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class UserCollection extends ResourceCollection
{
    /**
     * The resource that this resource collects.
     */
    public $collects = UserResource::class;

    public function toArray(Request $request): array
    {
        return [
            'data'       => $this->collection,
            'statistics' => [
                'total'       => $this->collection->count(),
                'active'      => $this->collection->where('is_active', true)->count(),
            ],
        ];
    }
}
```

### 31.3 Using Resources

```php
// Single resource
return new UserResource($user);
return UserResource::make($user);

// Collection
return UserResource::collection(User::paginate(20));
return new UserCollection(User::paginate(20));

// With additional data
return (new UserResource($user))
    ->additional([
        'meta' => ['request_id' => request()->id()],
    ]);

// Response customization
return (new UserResource($user))
    ->response()
    ->header('X-Custom', 'value')
    ->setStatusCode(201);

// Disable wrapping (globally)
// In AppServiceProvider boot():
JsonResource::withoutWrapping();
```

---

## 32. Localization (i18n)

### 32.1 Language Files

```
lang/
├── en/
│   ├── auth.php
│   ├── messages.php
│   ├── pagination.php
│   └── validation.php
├── vi/
│   ├── auth.php
│   ├── messages.php
│   └── validation.php
├── en.json          # JSON translation files
└── vi.json
```

```php
// lang/en/messages.php
return [
    'welcome' => 'Welcome to our application!',
    'greeting' => 'Hello, :name!',              // With placeholder
    'apples' => '{0} no apples|{1} one apple|[2,*] :count apples', // Pluralization
    'inbox' => [
        'title'   => 'Inbox',
        'unread'  => 'You have :count unread message(s).',
    ],
];

// lang/en.json (for simple key-value translations)
{
    "I love programming.": "I love programming.",
    "Welcome back, :name!": "Welcome back, :name!"
}
```

### 32.2 Usage

```php
// Basic translation
echo __('messages.welcome');
echo trans('messages.welcome');
echo __('messages.greeting', ['name' => 'John']);

// JSON translations
echo __('I love programming.');
echo __('Welcome back, :name!', ['name' => 'John']);

// Pluralization
echo trans_choice('messages.apples', 0);     // "no apples"
echo trans_choice('messages.apples', 1);     // "one apple"
echo trans_choice('messages.apples', 10);    // "10 apples"

// In Blade
{{ __('messages.welcome') }}
@lang('messages.welcome')
{{ trans_choice('messages.apples', 5) }}

// Set locale
App::setLocale('vi');
$locale = App::currentLocale();

if (App::isLocale('en')) {
    // ...
}

// Locale middleware
class SetLocale
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($locale = $request->header('Accept-Language')) {
            App::setLocale(Str::before($locale, ','));
        }
        return $next($request);
    }
}
```

---

## 33. Broadcasting (WebSockets)

### 33.1 Setup

```bash
composer require pusher/pusher-php-server    # Pusher driver
# OR
composer require beyondcode/laravel-websockets # Self-hosted

npm install --save-dev laravel-echo pusher-js
```

```env
BROADCAST_DRIVER=pusher
PUSHER_APP_ID=your-id
PUSHER_APP_KEY=your-key
PUSHER_APP_SECRET=your-secret
PUSHER_APP_CLUSTER=mt1
```

### 33.2 Event Broadcasting

```php
namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MessageSent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public User $user,
        public Message $message,
    ) {}

    /**
     * Channels to broadcast on.
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('chat.' . $this->message->room_id),
        ];
    }

    /**
     * Event name (default: class name)
     */
    public function broadcastAs(): string
    {
        return 'message.sent';
    }

    /**
     * Data to broadcast.
     */
    public function broadcastWith(): array
    {
        return [
            'id'      => $this->message->id,
            'content' => $this->message->content,
            'user'    => [
                'id'   => $this->user->id,
                'name' => $this->user->name,
            ],
        ];
    }

    /**
     * Determine if this event should broadcast.
     */
    public function broadcastWhen(): bool
    {
        return $this->message->is_visible;
    }
}
```

### 33.3 Channel Authorization

```php
// routes/channels.php
use Illuminate\Support\Facades\Broadcast;

// Private channel
Broadcast::channel('chat.{roomId}', function (User $user, int $roomId) {
    return $user->rooms->contains($roomId);
});

// Presence channel (returns data about the user)
Broadcast::channel('chat.{roomId}', function (User $user, int $roomId) {
    if ($user->rooms->contains($roomId)) {
        return ['id' => $user->id, 'name' => $user->name];
    }
});
```

### 33.4 Client-Side (Laravel Echo)

```javascript
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

const echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    forceTLS: true,
});

// Public channel
echo.channel('orders')
    .listen('OrderShipped', (e) => {
        console.log(e.order.id);
    });

// Private channel
echo.private('chat.1')
    .listen('.message.sent', (e) => {    // Note the dot prefix for broadcastAs
        console.log(e.content);
    });

// Presence channel
echo.join('chat.1')
    .here((users) => { /* All users in channel */ })
    .joining((user) => { /* User joined */ })
    .leaving((user) => { /* User left */ })
    .listen('.message.sent', (e) => { /* ... */ });

// Whisper (client-to-client, no server)
echo.private('chat.1')
    .whisper('typing', { user: 'John' });

echo.private('chat.1')
    .listenForWhisper('typing', (e) => {
        console.log(e.user + ' is typing...');
    });
```

---

## 34. Rate Limiting

### 34.1 Defining Rate Limiters

```php
// In AppServiceProvider boot() or RouteServiceProvider
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;

RateLimiter::for('api', function (Request $request) {
    return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
});

// Different limits per user type
RateLimiter::for('uploads', function (Request $request) {
    return $request->user()->isPremium()
        ? Limit::none()
        : Limit::perMinute(10)->by($request->user()->id);
});

// Multiple rate limits
RateLimiter::for('login', function (Request $request) {
    return [
        Limit::perMinute(5)->by($request->ip()),          // 5 per minute per IP
        Limit::perHour(50)->by($request->ip()),            // 50 per hour per IP
    ];
});

// Custom response
RateLimiter::for('api', function (Request $request) {
    return Limit::perMinute(60)
        ->by($request->user()?->id ?: $request->ip())
        ->response(function (Request $request, array $headers) {
            return response()->json([
                'message' => 'Too many requests. Please slow down.',
            ], 429, $headers);
        });
});
```

### 34.2 Applying Rate Limits

```php
// In routes
Route::middleware('throttle:api')->group(function () {
    Route::get('/posts', [PostController::class, 'index']);
});

// Custom named limiter
Route::middleware('throttle:uploads')->group(function () {
    Route::post('/upload', [UploadController::class, 'store']);
});

// Inline limit
Route::middleware('throttle:10,1')->group(function () {
    // 10 requests per 1 minute
});
```

### 34.3 Manual Rate Limiting

```php
use Illuminate\Support\Facades\RateLimiter;

$executed = RateLimiter::attempt(
    key: 'send-sms:' . $user->id,
    maxAttempts: 5,
    callback: function () use ($user) {
        // Send SMS
    },
    decaySeconds: 60
);

if (! $executed) {
    return 'Too many attempts. Please try again later.';
}

// Check remaining attempts
$remaining = RateLimiter::remaining('send-sms:' . $user->id, 5);
$retryAfter = RateLimiter::availableIn('send-sms:' . $user->id);

// Clear limiter
RateLimiter::clear('send-sms:' . $user->id);
```

---

## 35. Helpers & Collections

### 35.1 String Helpers (Str)

```php
use Illuminate\Support\Str;

Str::after('Hello World', 'Hello ');          // "World"
Str::before('Hello World', ' World');         // "Hello"
Str::between('This [is] test', '[', ']');     // "is"
Str::camel('foo_bar');                         // "fooBar"
Str::studly('foo_bar');                        // "FooBar"
Str::snake('fooBar');                          // "foo_bar"
Str::kebab('fooBar');                          // "foo-bar"
Str::title('foo bar');                         // "Foo Bar"
Str::headline('foo_bar');                      // "Foo Bar"
Str::slug('Laravel Framework', '-');           // "laravel-framework"
Str::upper('hello');                           // "HELLO"
Str::lower('HELLO');                           // "hello"
Str::ucfirst('hello');                         // "Hello"
Str::lcfirst('Hello');                         // "hello"
Str::contains('Hello', 'ell');                 // true
Str::containsAll('Hello', ['ell', 'Hel']);     // true
Str::startsWith('Hello', 'He');                // true
Str::endsWith('Hello', 'lo');                  // true
Str::length('Hello');                          // 5
Str::limit('Long text here', 10);              // "Long text ..."
Str::words('The quick brown fox', 3);          // "The quick brown..."
Str::plural('car');                            // "cars"
Str::singular('cars');                         // "car"
Str::replace('bar', 'baz', 'foobar');          // "foobaz"
Str::replaceFirst('a', 'b', 'aaa');            // "baa"
Str::replaceLast('a', 'b', 'aaa');             // "aab"
Str::reverse('Hello');                          // "olleH"
Str::mask('john@example.com', '*', 3);         // "joh*************"
Str::padLeft('5', 3, '0');                     // "005"
Str::padRight('5', 3, '0');                    // "500"
Str::uuid();                                   // UUID v4
Str::ulid();                                   // ULID
Str::orderedUuid();                            // Time-ordered UUID
Str::random(16);                               // Random string
Str::is('foo*', 'foobar');                     // true (pattern match)
Str::isUuid('a0a2...');                        // true/false
Str::isUlid('01ARZ...');                       // true/false
Str::isJson('{}');                             // true
Str::isUrl('https://example.com');             // true
Str::wordCount('Hello World');                 // 2
Str::squish('  hello   world  ');              // "hello world"
Str::trim('  hello  ');                        // "hello"
Str::wrap('value', '"');                        // '"value"'
Str::unwrap('"value"', '"');                   // 'value'
Str::excerpt('Long text...', 'text', ['radius' => 5]);

// Fluent strings
$result = Str::of('Hello World')
    ->lower()
    ->replace('hello', 'hi')
    ->slug()
    ->toString();
// "hi-world"

// Common fluent chain methods
Str::of('  fooBar  ')
    ->trim()
    ->snake()
    ->upper()
    ->toString();
// "FOO_BAR"
```

### 35.2 Array Helpers (Arr)

```php
use Illuminate\Support\Arr;

Arr::get($array, 'key', 'default');
Arr::get($array, 'nested.key');               // Dot notation
Arr::set($array, 'key', 'value');
Arr::has($array, 'key');
Arr::has($array, ['key1', 'key2']);             // Check multiple
Arr::hasAny($array, ['key1', 'key2']);
Arr::first($array, fn($v) => $v > 10);
Arr::last($array, fn($v) => $v > 10);
Arr::flatten($array);                          // Multi-dimensional → single
Arr::flatten($array, 1);                       // Depth limit
Arr::dot($array);                              // ['a.b' => 'value']
Arr::undot(['a.b' => 'value']);                // ['a' => ['b' => 'value']]
Arr::only($array, ['key1', 'key2']);
Arr::except($array, ['key1']);
Arr::pluck($array, 'name');
Arr::pluck($array, 'name', 'id');
Arr::where($array, fn($v, $k) => $v > 10);
Arr::whereNotNull($array);
Arr::map($array, fn($v) => $v * 2);
Arr::sort($array);
Arr::sortDesc($array);
Arr::sortRecursive($array);
Arr::random($array);
Arr::random($array, 3);                       // Multiple random
Arr::shuffle($array);
Arr::wrap('string');                           // ['string']
Arr::wrap(null);                               // []
Arr::wrap([1, 2]);                             // [1, 2]
Arr::collapse([[1, 2], [3, 4]]);               // [1, 2, 3, 4]
Arr::crossJoin([1, 2], ['a', 'b']);            // [[1,'a'], [1,'b'], [2,'a'], [2,'b']]
Arr::divide($array);                           // [keys[], values[]]
Arr::forget($array, 'key');
Arr::pull($array, 'key');                      // Get and remove
Arr::prepend($array, 'value');
Arr::prepend($array, 'value', 'key');
Arr::query(['name' => 'John', 'age' => 30]);  // "name=John&age=30"
Arr::join(['a', 'b', 'c'], ', ', ' and ');    // "a, b and c"
Arr::keyBy($array, 'id');
Arr::accessible($value);                       // Is it array-accessible?
Arr::exists($array, 'key');
Arr::isList($array);                           // Sequential 0-indexed?
Arr::toCssClasses(['p-4', 'font-bold' => true, 'bg-red' => false]);
// "p-4 font-bold"
Arr::toCssStyles(['background-color: red', 'font-weight: bold' => true]);
```

### 35.3 Collection Methods

```php
use Illuminate\Support\Collection;

$collection = collect([1, 2, 3, 4, 5]);

// ── Creation ──────────────────────────────
collect([1, 2, 3]);
Collection::make([1, 2, 3]);
Collection::times(5, fn($n) => $n * 2);        // [2, 4, 6, 8, 10]
Collection::range(1, 5);                        // [1, 2, 3, 4, 5]
Collection::wrap('string');                     // ['string']

// ── Iteration ─────────────────────────────
$collection->each(fn($item) => /* ... */);
$collection->eachSpread(fn($a, $b) => /* ... */);  // For nested arrays

// ── Filtering ─────────────────────────────
$collection->filter(fn($v) => $v > 3);          // [4, 5]
$collection->reject(fn($v) => $v > 3);          // [1, 2, 3]
$collection->where('key', 'value');
$collection->whereIn('key', [1, 2]);
$collection->whereNotIn('key', [1, 2]);
$collection->whereBetween('key', [1, 5]);
$collection->whereNull('key');
$collection->whereNotNull('key');
$collection->whereInstanceOf(User::class);
$collection->first(fn($v) => $v > 3);
$collection->firstWhere('status', 'active');
$collection->last(fn($v) => $v > 3);
$collection->sole(fn($v) => $v === 3);          // Exactly one match or throw
$collection->unique();
$collection->unique('key');
$collection->duplicates();
$collection->duplicates('key');

// ── Transforming ──────────────────────────
$collection->map(fn($v) => $v * 2);
$collection->mapWithKeys(fn($v) => [$v => $v * 2]);
$collection->flatMap(fn($v) => [$v, $v * 2]);
$collection->transform(fn($v) => $v * 2);       // Mutates in-place
$collection->pluck('name');
$collection->pluck('name', 'id');
$collection->flatten();
$collection->flatten(1);                          // Depth
$collection->collapse();                          // [[1,2],[3,4]] → [1,2,3,4]
$collection->zip([10, 20, 30]);                   // [[1,10],[2,20],[3,30]]
$collection->combine(['a', 'b', 'c']);            // [1=>'a', 2=>'b', 3=>'c']
$collection->flip();                              // Keys ↔ values
$collection->values();                            // Reset keys
$collection->keys();                              // Only keys
$collection->pad(8, 0);                           // Pad to length with value
$collection->mapToGroups(fn($v, $k) => [$v['dept'] => $v['name']]);

// ── Sorting ───────────────────────────────
$collection->sort();
$collection->sortDesc();
$collection->sortBy('name');
$collection->sortByDesc('name');
$collection->sortBy([
    ['name', 'asc'],
    ['age', 'desc'],
]);
$collection->sortKeys();
$collection->reverse();
$collection->shuffle();

// ── Aggregation ───────────────────────────
$collection->sum();
$collection->sum('price');
$collection->sum(fn($v) => $v->price * $v->quantity);
$collection->avg();
$collection->min();
$collection->max();
$collection->count();
$collection->countBy();                          // Count occurrences
$collection->countBy(fn($v) => $v > 3);
$collection->median();
$collection->mode();

// ── Slicing ───────────────────────────────
$collection->take(3);                            // First 3
$collection->take(-3);                           // Last 3
$collection->skip(2);                            // Skip first 2
$collection->slice(1, 3);                        // Offset 1, length 3
$collection->chunk(2);                           // [[1,2], [3,4], [5]]
$collection->chunkWhile(fn($v, $k, $chunk) => $v === $chunk->last());
$collection->splitIn(3);                         // Split into N groups
$collection->nth(2);                             // Every 2nd item
$collection->forPage(2, 3);                      // Page 2, 3 per page
$collection->splice(2, 1, [10, 11]);             // Remove and insert

// ── Grouping ──────────────────────────────
$collection->groupBy('type');
$collection->groupBy(fn($v) => $v['type']);
$collection->keyBy('id');
$collection->partition(fn($v) => $v > 3);       // [pass, fail]

// ── Checking ──────────────────────────────
$collection->isEmpty();
$collection->isNotEmpty();
$collection->contains(3);
$collection->contains('name', 'John');
$collection->contains(fn($v) => $v > 10);
$collection->every(fn($v) => $v > 0);
$collection->doesntContain(99);
$collection->has(0);                              // Has key

// ── Combining ─────────────────────────────
$collection->merge([6, 7, 8]);
$collection->concat([6, 7, 8]);                  // Preserves keys
$collection->union([10 => 'a', 20 => 'b']);
$collection->push(6);
$collection->prepend(0);
$collection->put('key', 'value');

// ── Set operations ────────────────────────
$collection->intersect([2, 4, 6]);
$collection->intersectByKeys($other);
$collection->diff([2, 4]);
$collection->diffKeys($other);
$collection->diffAssoc($other);

// ── Reducing ──────────────────────────────
$collection->reduce(fn($carry, $v) => $carry + $v, 0);
$collection->pipe(fn($c) => $c->sum());          // Pass whole collection
$collection->pipeInto(SumCalculator::class);
$collection->pipeThrough([fn($c) => $c->filter(), fn($c) => $c->sort()]);

// ── Higher-order messages ─────────────────
$collection->each->delete();                      // Call delete() on each
$collection->map->name;                           // Pluck 'name'
$collection->filter->isActive();                  // Filter by method
$collection->sum->price;                          // Sum property

// ── Lazy collections (memory efficient) ──
$lazy = LazyCollection::make(function () {
    $handle = fopen('large-file.csv', 'r');
    while (($line = fgets($handle)) !== false) {
        yield str_getcsv($line);
    }
});

$lazy->take(100)->each(fn($row) => /* ... */);

// Eloquent lazy
User::cursor()->filter(fn($u) => $u->is_active)->each(fn($u) => /* ... */);
```

### 35.4 Path & URL Helpers

```php
// Paths
app_path('Models/User.php');          // /app/Models/User.php
base_path('vendor');                   // /vendor
config_path('app.php');                // /config/app.php
database_path('migrations');           // /database/migrations
lang_path('en/messages.php');          // /lang/en/messages.php
public_path('css/app.css');            // /public/css/app.css
resource_path('views');                // /resources/views
storage_path('app/file.txt');          // /storage/app/file.txt

// URLs
url('/posts');                         // http://localhost/posts
url()->current();                      // Current URL
url()->full();                         // With query string
url()->previous();                     // Referer URL
secure_url('/posts');                   // https://localhost/posts
asset('css/app.css');                  // http://localhost/css/app.css
route('posts.show', ['post' => 1]);    // Named route URL
action([PostController::class, 'index']);
```

### 35.5 Miscellaneous Helpers

```php
// App
app();                                 // Service container instance
app('cache');                          // Resolve from container
app()->environment('production');
app()->isLocal();
app()->isProduction();

// Auth
auth()->user();
auth()->id();
auth()->check();
auth()->guest();
auth()->guard('admin')->user();

// Config
config('app.name');
config('app.name', 'default');
config(['app.debug' => true]);         // Set at runtime

// Response
response('Hello', 200);
response()->json($data);
redirect('/home');
redirect()->route('home');
redirect()->back();
abort(404);
abort_if(! $user, 404);

// Misc
dd($variable);                         // Dump and die
dump($variable);                       // Dump (continue)
logger('Debug message');               // Log debug message
logger()->error('Error!', $context);
info('Info message');                   // Log info
report($exception);                    // Report exception
rescue(fn() => riskyOperation(), 'fallback');
retry(5, fn() => apiCall(), 100);      // Retry 5 times, 100ms delay
now();                                  // Carbon instance
today();                                // Carbon today
blank('');                              // true (empty string, null, empty array)
filled('hello');                        // true (not blank)
value(fn() => 'lazy');                 // Resolve closure
with($value, fn($v) => $v * 2);       // Pipe value through closure
tap($user, fn($u) => $u->update([...])); // Tap and return original
throw_if(true, new Exception('...'));
throw_unless(false, new Exception('...'));
```

---

## 36. Package Development

### 36.1 Package Structure

```
packages/vendor/package-name/
├── config/
│   └── package.php
├── database/
│   ├── factories/
│   ├── migrations/
│   └── seeders/
├── resources/
│   └── views/
├── routes/
│   └── web.php
├── src/
│   ├── Console/
│   │   └── Commands/
│   ├── Facades/
│   │   └── Package.php
│   ├── Http/
│   │   ├── Controllers/
│   │   └── Middleware/
│   ├── Models/
│   ├── PackageServiceProvider.php
│   └── Package.php
├── tests/
├── composer.json
├── LICENSE.md
└── README.md
```

### 36.2 Package Service Provider

```php
namespace Vendor\PackageName;

use Illuminate\Support\ServiceProvider;

class PackageServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->mergeConfigFrom(__DIR__.'/../config/package.php', 'package');

        $this->app->singleton('package', function ($app) {
            return new Package(config('package'));
        });
    }

    public function boot(): void
    {
        // Config
        $this->publishes([
            __DIR__.'/../config/package.php' => config_path('package.php'),
        ], 'package-config');

        // Migrations
        $this->publishesMigrations([
            __DIR__.'/../database/migrations' => database_path('migrations'),
        ], 'package-migrations');

        // Views
        $this->loadViewsFrom(__DIR__.'/../resources/views', 'package');
        $this->publishes([
            __DIR__.'/../resources/views' => resource_path('views/vendor/package'),
        ], 'package-views');

        // Routes
        $this->loadRoutesFrom(__DIR__.'/../routes/web.php');

        // Translations
        $this->loadTranslationsFrom(__DIR__.'/../lang', 'package');

        // Commands
        if ($this->app->runningInConsole()) {
            $this->commands([
                PackageCommand::class,
            ]);
        }

        // Blade components
        $this->loadViewComponentsAs('package', [
            Alert::class,
        ]);
    }
}
```

### 36.3 Package composer.json

```json
{
    "name": "vendor/package-name",
    "description": "A Laravel package",
    "type": "library",
    "license": "MIT",
    "require": {
        "php": "^8.1",
        "illuminate/support": "^10.0|^11.0"
    },
    "autoload": {
        "psr-4": {
            "Vendor\\PackageName\\": "src/"
        }
    },
    "extra": {
        "laravel": {
            "providers": [
                "Vendor\\PackageName\\PackageServiceProvider"
            ],
            "aliases": {
                "Package": "Vendor\\PackageName\\Facades\\Package"
            }
        }
    }
}
```

---

## 37. Deployment & Optimization

### 37.1 Optimization Commands

```bash
# Before deployment — cache everything
php artisan config:cache     # Cache config files
php artisan route:cache      # Cache routes
php artisan view:cache       # Compile Blade views
php artisan event:cache      # Cache event/listener mappings
php artisan icons:cache      # Cache icons (if using blade-icons)

# Single command for all
php artisan optimize

# Clear all caches
php artisan optimize:clear
```

### 37.2 Production .env

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com

LOG_CHANNEL=daily
LOG_LEVEL=warning

CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis

# OPcache should be enabled on the server
```

### 37.3 Deployment Script Example

```bash
#!/bin/bash
set -e

echo "🚀 Starting deployment..."

# Pull latest code
git pull origin main

# Install PHP dependencies (no dev)
composer install --no-dev --optimize-autoloader --no-interaction

# Install and build frontend
npm ci
npm run build

# Run migrations
php artisan migrate --force

# Clear and rebuild caches
php artisan optimize

# Restart queue workers
php artisan queue:restart

# Clear OPcache if using it
# php artisan opcache:clear

echo "✅ Deployment complete!"
```

### 37.4 Performance Best Practices

| Area | Best Practice |
|------|--------------|
| **Eager Loading** | Always use `with()` to prevent N+1 queries |
| **Database** | Add indexes on columns used in WHERE, ORDER BY, JOIN |
| **Caching** | Cache expensive queries with `Cache::remember()` |
| **Queues** | Offload heavy work (email, PDF, API calls) to queues |
| **Config Cache** | Always run `config:cache` in production |
| **Route Cache** | Always run `route:cache` in production |
| **Composer** | Use `--optimize-autoloader` in production |
| **OPcache** | Enable PHP OPcache |
| **Pagination** | Use `cursorPaginate()` for large datasets |
| **Chunking** | Use `chunk()` or `lazy()` when processing many records |
| **Select columns** | Use `select()` to avoid fetching unnecessary columns |
| **Redis** | Use Redis for cache, session, and queue drivers |
| **CDN** | Serve static assets via CDN |
| **Database** | Use read replicas for read-heavy workloads |

### 37.5 Server Requirements Checklist

```
✅ PHP 8.1+ with extensions: BCMath, Ctype, Fileinfo, JSON, Mbstring, OpenSSL, PDO, Tokenizer, XML
✅ Composer 2.x
✅ Web server: Nginx / Apache
✅ Database: MySQL 5.7+ / PostgreSQL 10+ / SQLite 3.35+
✅ Redis (recommended for cache, queue, sessions)
✅ Supervisor (for queue workers)
✅ Node.js 16+ (for building frontend assets)
✅ SSL certificate (HTTPS)
✅ OPcache enabled
```

### 37.6 Nginx Configuration

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com;
    root /var/www/yourapp/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

### 37.7 Supervisor Configuration (Queue Workers)

```ini
[program:laravel-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/yourapp/artisan queue:work redis --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=4
redirect_stderr=true
stdout_logfile=/var/www/yourapp/storage/logs/worker.log
stopwaitsecs=3600
```

---

## Quick Reference Card

### Artisan Generators

```bash
make:model        make:controller     make:migration
make:middleware    make:request        make:resource
make:rule         make:event          make:listener
make:job          make:mail           make:notification
make:policy       make:command        make:provider
make:observer     make:cast           make:factory
make:seeder       make:test           make:exception
make:component    make:channel        make:scope
```

### Common Route Patterns

```php
Route::apiResource('posts', PostController::class);
Route::middleware('auth:sanctum')->prefix('v1')->group(fn() => ...);
Route::get('{any}', SpaController::class)->where('any', '.*');
```

### Common Eloquent Patterns

```php
Model::query()->where()->with()->orderBy()->paginate();
Model::create([...]);
Model::updateOrCreate([search], [values]);
Model::findOrFail($id);
```

---

> **End of Laravel Comprehensive Reference Guide**
>
> This document covers the core features of Laravel 10.x/11.x. For the latest updates, always refer to the [official Laravel documentation](https://laravel.com/docs).
