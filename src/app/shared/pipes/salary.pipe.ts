import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'salary',
  standalone: true
})
export class SalaryPipe implements PipeTransform {

  /**
   * Transform salary numbers into a readable string with currency and locale
   * @param min Minimum salary
   * @param max Maximum salary
   * @param currency Currency code (default: USD)
   * @param locale Locale string (default: en-US)
   * @returns Formatted salary string
   */
  transform(
    min?: number | null,
    max?: number | null,
    currency: string = 'USD',
    locale: string = 'en-US'
  ): string {
    if (!min && !max) {
      return 'Salary not specified';
    }

    if (min && !max) {
      return `From ${this.formatCurrency(min, currency, locale)}`;
    }

    if (!min && max) {
      return `Up to ${this.formatCurrency(max, currency, locale)}`;
    }

    if (min && max) {
      return `${this.formatCurrency(min, currency, locale)} - ${this.formatCurrency(max, currency, locale)}`;
    }

    return 'Salary not specified';
  }

  private formatCurrency(amount: number, currency: string, locale: string): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }
}
