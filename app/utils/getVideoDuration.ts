import { getVideoDurationInSeconds } from "get-video-duration";
import { Readable } from "stream";
import { CourseLesson } from "../types/courses";

function format(seconds: number) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  return [hrs, mins, secs].map((v) => String(v).padStart(2, "0")).join(":");
}

export async function getVideoDuration(fileBuffer: Buffer): Promise<string> {
  const stream = Readable.from([fileBuffer]);
  const duration = await getVideoDurationInSeconds(stream);
  return format(duration);
}


export function getCourseDuration(lessons: CourseLesson[]) {
  let totalSeconds = 0;

  for (const lesson of lessons) {
    const [h = "0", m = "0", s = "0"] = lesson.duration.split(":");
    totalSeconds +=
      (Number(h) || 0) * 3600 + (Number(m) || 0) * 60 + (Number(s) || 0);
  }

  const totalMinutes = Math.ceil(totalSeconds / 60);
  const hrs = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;

  const parts = [];
  if (hrs) parts.push(`${hrs} ч`);
  if (mins) parts.push(`${mins} мин`);
  return parts.join(" ") || "0 мин";
}