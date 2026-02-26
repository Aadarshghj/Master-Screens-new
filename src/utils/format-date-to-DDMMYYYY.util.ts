export function formatToDDMMYYYY(input: string): string {
  if (!input) return "";

  const cleaned = input
    .trim()
    .replace(/[/.\s]/g, "-")
    .replace(/--+/g, "-");

  let day: string | number;
  let month: string | number;
  let year: string | number;

  if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(cleaned)) {
    [year, month, day] = cleaned.split("-");
  } else if (/^\d{1,2}-\d{1,2}-\d{4}$/.test(cleaned)) {
    [day, month, year] = cleaned.split("-");
  } else {
    const parsedDate = new Date(input);
    if (isNaN(parsedDate.getTime())) return "";

    day = parsedDate.getDate();
    month = parsedDate.getMonth() + 1;
    year = parsedDate.getFullYear();
  }

  const dd = String(day).padStart(2, "0");
  const mm = String(month).padStart(2, "0");
  const yyyy = String(year);

  return `${dd}-${mm}-${yyyy}`;
}

export function formatToYYYYMMDD(input: string): string {
  if (!input) return "";

  const cleaned = input.trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(cleaned)) {
    return cleaned;
  }

  if (/^\d{2}-\d{2}-\d{4}$/.test(cleaned)) {
    const [day, month, year] = cleaned.split("-");
    return `${year}-${month}-${day}`;
  }

  return "";
}
