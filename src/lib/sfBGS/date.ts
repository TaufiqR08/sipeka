/**
 * Date utility functions for formatting and calculating dates
 */

/**
 * Format date to Indonesian locale with short format
 * Example: "6 Okt 2025"
 */
export const formatDateShort = (dateString: string | Date): string => {
    try {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    } catch {
        return typeof dateString === 'string' ? dateString : 'Invalid Date';
    }
};

/**
 * Format date to Indonesian locale with long format
 * Example: "6 Oktober 2025"
 */
export const formatDateLong = (dateString: string | Date): string => {
    try {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    } catch {
        return typeof dateString === 'string' ? dateString : 'Invalid Date';
    }
};

/**
 * Format date to Indonesian locale with medium format
 * Example: "6 Okt 2025"
 */
export const formatDateMedium = (dateString: string | Date): string => {
    try {
        return new Date(dateString).toLocaleDateString('id-ID', {
            dateStyle: 'medium'
        });
    } catch {
        return typeof dateString === 'string' ? dateString : 'Invalid Date';
    }
};

/**
 * Format date with custom options
 */
export const formatDate = (
    dateString: string | Date,
    options?: Intl.DateTimeFormatOptions
): string => {
    try {
        const defaultOptions: Intl.DateTimeFormatOptions = {
            dateStyle: 'medium'
        };
        return new Date(dateString).toLocaleDateString('id-ID', options || defaultOptions);
    } catch {
        return typeof dateString === 'string' ? dateString : 'Invalid Date';
    }
};

/**
 * Calculate duration between two dates (inclusive)
 * If same day, returns "1 Day"
 * Otherwise, includes both start and end dates in the count
 * 
 * Example:
 * - 6 Okt → 6 Okt = "1 Day"
 * - 5 Okt → 10 Okt = "6 Days" (5, 6, 7, 8, 9, 10)
 */
export const getEventDuration = (
    startDate: string | Date,
    endDate: string | Date
): string => {
    if (!endDate || !startDate) {
        return '1 Day';
    }

    try {
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Reset time to midnight for accurate day calculation
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);

        const diffTime = end.getTime() - start.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        // If same day or duration is 0, it's 1 day event
        // Otherwise, add 1 to include both start and end dates (inclusive)
        const totalDays = diffDays === 0 ? 1 : diffDays + 1;

        return totalDays === 1 ? '1 Day' : `${totalDays} Days`;
    } catch {
        return '1 Day';
    }
};

/**
 * Check if a date is today
 */
export const isToday = (date: string | Date): boolean => {
    try {
        const today = new Date();
        const checkDate = new Date(date);

        today.setHours(0, 0, 0, 0);
        checkDate.setHours(0, 0, 0, 0);

        return today.getTime() === checkDate.getTime();
    } catch {
        return false;
    }
};

/**
 * Check if a date is in the past
 */
export const isPastDate = (date: string | Date): boolean => {
    try {
        const today = new Date();
        const checkDate = new Date(date);

        today.setHours(0, 0, 0, 0);
        checkDate.setHours(0, 0, 0, 0);

        return checkDate.getTime() < today.getTime();
    } catch {
        return false;
    }
};

/**
 * Check if a date is in the future
 */
export const isFutureDate = (date: string | Date): boolean => {
    try {
        const today = new Date();
        const checkDate = new Date(date);

        today.setHours(0, 0, 0, 0);
        checkDate.setHours(0, 0, 0, 0);

        return checkDate.getTime() > today.getTime();
    } catch {
        return false;
    }
};

/**
 * Get relative time string (e.g., "2 days ago", "in 3 days")
 */
export const getRelativeTime = (date: string | Date): string => {
    try {
        const now = new Date();
        const checkDate = new Date(date);

        now.setHours(0, 0, 0, 0);
        checkDate.setHours(0, 0, 0, 0);

        const diffTime = checkDate.getTime() - now.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Tomorrow';
        if (diffDays === -1) return 'Yesterday';
        if (diffDays > 0) return `in ${diffDays} days`;
        return `${Math.abs(diffDays)} days ago`;
    } catch {
        return 'Unknown';
    }
};

/**
 * Convert Date or ISO string to YYYY-MM-DD format string
 * This ensures consistent date comparison regardless of timezone
 * 
 * Example:
 * - getDateString(new Date(2025, 9, 7)) => "2025-10-07"
 * - getDateString("2025-10-07T10:30:00Z") => "2025-10-07"
 */
export const getDateString = (input: string | Date): string => {
    let date: Date;

    if (input instanceof Date) {
        // If it's already a Date object, we need to format it properly
        // to ensure we're comparing dates only, not including time
        date = new Date(input.getFullYear(), input.getMonth(), input.getDate());
    } else {
        // If it's an ISO string, create a Date object and extract just the date part
        const tempDate = new Date(input);
        date = new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate());
    }

    // Format to YYYY-MM-DD string
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

/**
 * Check if a date is a weekend (Saturday or Sunday)
 */
export const isWeekend = (date: string | Date): boolean => {
    try {
        const dateObj = date instanceof Date ? date : new Date(date);
        const day = dateObj.getDay();
        return day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
    } catch {
        return false;
    }
};

/**
 * Check if a date falls within a date range (inclusive)
 * 
 * @param date - The date to check
 * @param startDate - Start of the range
 * @param endDate - End of the range (optional, defaults to startDate)
 * @returns true if date is within range
 */
export const isDateInRange = (
    date: string | Date,
    startDate: string | Date,
    endDate?: string | Date
): boolean => {
    try {
        const dateStr = getDateString(date);
        const startStr = getDateString(startDate);
        const endStr = endDate ? getDateString(endDate) : startStr;

        // Handle invalid ranges
        if (endStr < startStr) {
            return dateStr === startStr;
        }

        return dateStr >= startStr && dateStr <= endStr;
    } catch {
        return false;
    }
};



/**
const result = getRemainingDays("2023-08-07", 4);
{
  targetDate: 2027-08-07T00:00:00.000Z,
  remainingDays: 455,
  expired: false
}
 */
export const getRemainingDays = (
    startDate: string | Date,
    yearsToAdd: number
) => {
    try {
        const date =
            startDate instanceof Date
                ? startDate
                : new Date(startDate);

        // tanggal target
        const targetDate = new Date(date);
        targetDate.setFullYear(targetDate.getFullYear() + yearsToAdd);

        // hari ini (tanpa jam)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // target tanpa jam
        targetDate.setHours(0, 0, 0, 0);

        // selisih ms -> hari
        const diffMs = targetDate.getTime() - today.getTime();

        const remainingDays = Math.ceil(
            diffMs / (1000 * 60 * 60 * 24)
        );

        return {
            targetDate,
            remainingDays,
            expired: remainingDays < 0,
        };
    } catch {
        return {
            targetDate: null,
            remainingDays: 0,
            expired: false,
        };
    }
};
