import { localStorageData } from '~/server/cache';

export const formatCurrency = (value: number, locale = 'en-US') => {
  const roundedValue = value % 1 >= 0.5 ? Math.ceil(value) : Math.floor(value);
  return new Intl.NumberFormat(locale, {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
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

export const cleanedDescription = (description: string, maxLines = 5) => {
  const cleaned = description
    ?.replace(/\r\n/g, '<div style="height: 7px"></div>')
    ?.replace(/<h1>/g, '<h1 style="font-weight: bold;">')
    ?.replace(/<\/h1>/g, '</h1>')
    ?.replace(/<h2>/g, '<h1 style="font-weight: bold;">');

  // Create a temporary DOM element to parse the HTML and extract text content
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = cleaned || '';
  const textContent = tempDiv.textContent || '';

  const lines = textContent.split('\n').slice(0, maxLines).join('\n');
  return `<div style="display: -webkit-box; -webkit-line-clamp: ${maxLines}; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; padding: 0; margin: 0;">${lines}</div>`;
};

export const cleanedBlogDescription = (description: string, maxLines = 5) => {
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
    const htmlWithOnClick = htmlContent.replace(/<img([^>]*)src=["']([^"']+)["']([^>]*)>/gi, (imgTag, beforeSrc, src, afterSrc) => {
      // Add onclick only if not already present
      if (/onclick\s*=/.test(imgTag)) return imgTag;
      return `<img${beforeSrc}src="${src}"${afterSrc} onclick="window.open('${src}', '_blank')" style="cursor:pointer;" />`;
    });
    return `<div style="text-align: center;"><div style="display: inline-block; text-align: left;" >${htmlWithOnClick.replace(/<img[^>]*>/gi, (img) => `<div style="margin: 1em 0; display: flex; justify-content: center;">${img}</div>`)}</div></div>`;
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
