<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ConfirmOrderCheckout extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;
    public Order $order;
    /**
     * Create a new message instance.
     */
    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Confirm Order Checkout',
        );
    }

    public function build()
    {
        $appName = config('app.name');

        return $this->subject("[{$appName}] Order Confirmation - {$this->order->order_code}")
            ->html("
                <h3>Hello {$this->order->customer_name},</h3>

                <p>Thank you for your order.</p>

                <p>Your order has been successfully placed and is currently being processed.</p>

                <p>
                    <strong>Order Code:</strong> {$this->order->order_code}<br>
                    <strong>Total Amount:</strong> $" . number_format($this->order->total_amount, 2) . "
                </p>

                <p>
                    We will notify you once your order has been confirmed and shipped.
                </p>

                <p>
                    Thank you for shopping with us.
                </p>

                <p>
                    Best regards,<br>
                    {$appName} Team
                </p>
            ");
    }
}
