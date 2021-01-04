import moment from "moment";

export function lastArrayElement(array: any[]) {
  return array[array.length - 1]
}

export function hyphenToSpace(str: string) {
  return str.replace(/-/g, " ");
}

export function timeMinutesLater(minutes: number) {
  return moment(new Date()).add(minutes, 'minutes').toDate();
}