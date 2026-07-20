import { PurposeEbookChapter } from "./purposeEbook.types";
import { CHAPTER_01_QUESTION } from "./catalog/chapters/chapter01Question";
import { CHAPTER_02_WHO_IS_ALLAH } from "./catalog/chapters/chapter02WhoIsAllah";
import { CHAPTER_03_WHY_CREATED } from "./catalog/chapters/chapter03WhyCreated";
import { CHAPTER_04_THIS_LIFE } from "./catalog/chapters/chapter04ThisLife";
import { CHAPTER_05_HEREAFTER } from "./catalog/chapters/chapter05Hereafter";
import { CHAPTER_06_SALAH } from "./catalog/chapters/chapter06Salah";
import { CHAPTER_07_PRAYER_MEANINGS } from "./catalog/chapters/chapter07PrayerMeanings";
import { CHAPTER_08_TESTS } from "./catalog/chapters/chapter08Tests";
import { CHAPTER_09_SINS_REPENTANCE } from "./catalog/chapters/chapter09SinsRepentance";
import { CHAPTER_10_SHAYTAN_TRICKS } from "./catalog/chapters/chapter10ShaytanTricks";
import { CHAPTER_11_RELATIONSHIP } from "./catalog/chapters/chapter11Relationship";
import { CHAPTER_12_DAILY_PURPOSE } from "./catalog/chapters/chapter12DailyPurpose";
import { CHAPTER_13_PREPARING_DEATH } from "./catalog/chapters/chapter13PreparingDeath";
import { CHAPTER_14_LIFE_YOU_WANT } from "./catalog/chapters/chapter14LifeYouWant";
import { CHAPTER_15_LETTER } from "./catalog/chapters/chapter15Letter";

/** Ordered catalog of My Purpose companion chapters. */
export class PurposeEbookCatalog {
  private static readonly CHAPTERS: PurposeEbookChapter[] = [
    CHAPTER_01_QUESTION,
    CHAPTER_02_WHO_IS_ALLAH,
    CHAPTER_03_WHY_CREATED,
    CHAPTER_04_THIS_LIFE,
    CHAPTER_05_HEREAFTER,
    CHAPTER_06_SALAH,
    CHAPTER_07_PRAYER_MEANINGS,
    CHAPTER_08_TESTS,
    CHAPTER_09_SINS_REPENTANCE,
    CHAPTER_10_SHAYTAN_TRICKS,
    CHAPTER_11_RELATIONSHIP,
    CHAPTER_12_DAILY_PURPOSE,
    CHAPTER_13_PREPARING_DEATH,
    CHAPTER_14_LIFE_YOU_WANT,
    CHAPTER_15_LETTER,
  ];

  static all(): PurposeEbookChapter[] {
    return PurposeEbookCatalog.CHAPTERS;
  }

  static count(): number {
    return PurposeEbookCatalog.CHAPTERS.length;
  }

  static byId(id: string): PurposeEbookChapter | undefined {
    return PurposeEbookCatalog.CHAPTERS.find((chapter) => chapter.id === id);
  }

  static indexOf(id: string): number {
    return PurposeEbookCatalog.CHAPTERS.findIndex((chapter) => chapter.id === id);
  }

  static previousId(id: string): string | null {
    const index = this.indexOf(id);
    if (index <= 0) return null;
    return PurposeEbookCatalog.CHAPTERS[index - 1]?.id ?? null;
  }

  static nextId(id: string): string | null {
    const index = this.indexOf(id);
    if (index < 0 || index >= PurposeEbookCatalog.CHAPTERS.length - 1) return null;
    return PurposeEbookCatalog.CHAPTERS[index + 1]?.id ?? null;
  }
}
