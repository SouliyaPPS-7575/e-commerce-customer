import { localStorageData } from '~/server/cache';

export const formatCurrency = (value: number, locale = 'en-US') => {
  // Round to two decimal places, but if the third decimal is 5, round down
  const thirdDecimal = Math.floor((value * 1000) % 10);
  let roundedValue: number;
  if (thirdDecimal === 5) {
    // Round down to two decimals
    roundedValue = Math.floor(value * 100) / 100;
  } else {
    // Standard rounding to two decimals
    roundedValue = Math.round(value * 100) / 100;
  }
  return new Intl.NumberFormat(locale, {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(roundedValue);
};

export const formattedDate = (date: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  return new Date(date).toLocaleDateString('en-GB', options);
};

export function formatDateDMY(dateStr: string | Date): string {
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

export const viewAvatar = (avatar?: string) => {
  const avatarUrl = avatar?.startsWith('http')
    ? avatar
    : `${process.env.BASE_URL}/api/files/_pb_users_auth_/${localStorageData('customer_id').getLocalStrage()}/${avatar}?token=${localStorageData('token').getLocalStrage()}`;
  return avatarUrl;
};

export const cleanedDescriptionShort = (description: string, maxLines = 5) => {
  if (!description) return '';

  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = description;

  // Remove all image tags first
  const imgTags = tempDiv.querySelectorAll('img');
  imgTags.forEach(img => img.remove());

  // Get the cleaned HTML without images
  let htmlContent = tempDiv.innerHTML;

  // Clean up HTML content
  htmlContent = htmlContent
    // Convert empty <p></p> tags or those with only whitespace to <br>
    .replace(/<p[^>]*>(\s|&nbsp;)*<\/p>/gi, '<br>')
    // Remove remaining <p> opening tags
    .replace(/<p[^>]*>/gi, '')
    // Replace closing </p> tags with <br>
    .replace(/<\/p>/gi, '<br>')
    // Limit consecutive <br> tags to maximum 2
    .replace(/(<br\s*\/?>\s*){3,}/gi, '<br>')
    // Remove <br> at start or end
    .replace(/^(<br\s*\/?>)+|(<br\s*\/?>)+$/gi, '')
    // Remove any remaining img tags (as a safety measure)
    .replace(/<img[^>]*>/gi, '')
    .trim();

  // If content is empty after cleaning, return empty string
  if (!htmlContent) return '';

  // If maxLines is 0, return full content without clamping
  if (maxLines === 0) {
    return `<div>${htmlContent}</div>`;
  }

  // Apply line clamping with ellipsis
  return `
    <div style="
      display: -webkit-box;
      -webkit-line-clamp: ${maxLines};
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      padding: 0;
      margin: 0;
      line-height: 1.5em;
      word-wrap: break-word;
      hyphens: auto;
    ">
      ${htmlContent}
    </div>
  `;
};

export const cleanedBlogDescriptionDetails = (
  description: string,
  maxLines?: number,
) => {
  if (!description) return '';

  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = description;

  // Otherwise, convert <p> tags to <br> and clean up
  let htmlContent = description;

  // Convert <p> tags to <br> for line breaks
  htmlContent = htmlContent
    // Convert empty <p></p> tags or those with only whitespace to <br>
    .replace(/<p[^>]*>(\s|&nbsp;)*<\/p>/gi, '<br>')
    // Remove remaining <p> opening tags
    .replace(/<p[^>]*>/gi, '')
    // Replace closing </p> tags with <br>
    .replace(/<\/p>/gi, '<br>')
    // Limit consecutive <br> tags to maximum 2
    .replace(/(<br\s*\/?>\s*){3,}/gi, '<br>')
    // Remove <br> at start or end
    .replace(/^(<br\s*\/?>)+|(<br\s*\/?>)+$/gi, '')
    .trim();

  // If content is empty after cleaning, return empty string
  if (!htmlContent) return '';

  // If there's an image, return full HTML content
  const hasImage = tempDiv.querySelector('img');
  if (hasImage) {
    // Add onclick to each img tag to open src in new tab
    const htmlWithOnClick = htmlContent.replace(
      /<img([^>]*)src=["']([^"']+)["']([^>]*)>/gi,
      (imgTag, beforeSrc, src, afterSrc) => {
        // Add onclick only if not already present
        if (/onclick\s*=/.test(imgTag)) return imgTag;
        return `<img${beforeSrc}src="${src}"${afterSrc} onclick="window.open('${src}', '_blank')" style="cursor:pointer;" />`;
      },
    );
    return `<div style="text-align: center;"><div style="display: inline-block; text-align: left;" >${htmlWithOnClick.replace(/<img[^>]*>/gi, (img) => `<div style="margin: 1em 0; display: flex; justify-content: center;">${img}</div>`)}</div></div>`;
  }

  // If maxLines is 0 or undefined, return full content without clamping
  if (maxLines === 0 || maxLines === undefined) {
    return `<div>${htmlContent}</div>`;
  }

  return `
    <div style="
      display: -webkit-box;
      -webkit-line-clamp: ${maxLines};
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      padding: 0;
      margin: 0;
      line-height: 1.5em;
      word-wrap: break-word;
      hyphens: auto;
    ">
      ${htmlContent}
    </div>
  `;
};
