<?php

namespace App\Enums;

enum OrderStatus: string
{
    case PENDING = 'pending';
    case CONFIRMED = 'confirmed';
    case SHIPPING = 'shipping';
    case DELIVERED = 'delivered';
    case CANCELLED = 'cancelled';

    /**
     * Danh sách trạng thái được phép chuyển đến từ trạng thái hiện tại
     *
     * pending   → confirmed | cancelled
     * confirmed → shipping  | cancelled
     * shipping  → delivered
     * delivered → (kết thúc)
     * cancelled → (kết thúc)
     */
    public function allowedTransitions(): array
    {
        return match ($this) {
            self::PENDING   => [self::CONFIRMED, self::CANCELLED],
            self::CONFIRMED => [self::SHIPPING, self::CANCELLED],
            self::SHIPPING  => [self::DELIVERED],
            self::DELIVERED => [],
            self::CANCELLED => [],
        };
    }

    /**
     * Kiểm tra trạng thái hiện tại có thể chuyển sang trạng thái mới không
     */
    public function canTransitionTo(self $newStatus): bool
    {
        return in_array($newStatus, $this->allowedTransitions());
    }

    /**
     * Hàm bổ trợ để lấy nhãn tiếng Việt hiển thị lên giao diện
     */
    public function label(): string
    {
        return match ($this) {
            self::PENDING => 'Chờ xử lý',
            self::CONFIRMED => 'Đã xác nhận',
            self::SHIPPING => 'Đang giao hàng',
            self::DELIVERED => 'Đã giao hàng',
            self::CANCELLED => 'Đã hủy',
        };
    }
}