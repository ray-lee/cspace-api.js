import util from 'util';

export default function log(object) {
  console.log(util.inspect(object, {
    depth: 6,
    colors: true,
  }));
}
