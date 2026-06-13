<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class GuestCancelOrderMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public Order $order;
    public string $confirmUrl;
    public string $token;

    public function __construct(Order $order, string $confirmUrl, string $token)
    {
        $this->order = $order;
        $this->confirmUrl = $confirmUrl;
        $this->token = $token;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Guest Cancel Order Mail',
        );
    }

    public function build()
    {
        $appName = config('app.name');
        return $this->subject("[{$appName}] Order Cancellation Confirmation Request - " . $this->order->order_code)
            ->html("
            <h3>Hello {$this->order->customer_name},</h3>

            <p>We have received a request to cancel your order <strong>{$this->order->order_code}</strong>.</p>

            <p>To complete the cancellation process and ensure account security, please click the link below. This link will remain valid for 15 minutes:</p>

            <p>
                <a href='{$this->confirmUrl}' style='margin: 0 auto; padding: 10px 20px; background: #ff4d4f; color: white; text-decoration: none; border-radius: 4px;'>
                    Confirm Order Cancellation
                </a>
            </p>

            <p>If the link got error you can manually use this code <strong style='background: #CCC'>{$this->token}</strong></p>

            <p>If you did not make this request, please ignore this email. Your order will continue to be processed as usual.</p>

            <p>Thank you,<br>Shop {$appName}</p>
        ");
    }
}
