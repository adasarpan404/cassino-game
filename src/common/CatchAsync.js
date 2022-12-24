/** @desc for catching async error */
export default function CatchAsync(fn) {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
}
