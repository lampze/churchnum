let zero = (f) => (x) => x;
let succ = (n) => (f) => (x) => f(n(f)(x));
let plusv1 = (n) => (m) => (f) => (x) => n(f)(m(f)(x));
let plusv2 = (n) => (m) => n(succ)(m);
let multv1 = (n) => (m) => m(plus(n))(zero);
let multv2 = (n) => (m) => (f) => m(n(f));
let exp = (n) => (m) => n(m);
let plus = plusv1;
let mult = multv2;
let one = (f) => (x) => f(x);
let two = succ(one);
let three = succ(two);
let four = succ(three);
let add1 = (n) => n + 1;
let prt = (x) => x(add1)(0);

let Y = (f) => ((x) => f(x(x)))((x) => f(x(x)));
let Z = (f) => ((x) => f((y) => x(x)(y)))((x) => f((y) => x(x)(y)));
let F = (f) => (x) => (x == 0 ? 1 : x * f(x - 1));
