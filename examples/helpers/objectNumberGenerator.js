export default function* objectNumberGenerator(prefix, start, end) {
  for (let num = start; num <= end; num += 1) {
    yield `${prefix}${num}`;
  }
}
