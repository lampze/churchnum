// function lc2js(str = "") {
//   let isLegal = (str) => str.indexOf("lambda") == 0 || str.indexOf("λ") == 0;
//   let getBod = (str) => trim(delLambdaPre(str.split(".")[0]));
//   let getExp = (str) => trim(str.substr(str.split(".")[0].length + 1));
//   let trim = (str) => str.replace(/(^\s*)|(\s*$)/g, "");
//   let delLambdaPre = (str) => str.replace("lambda", "").replace("λ", "");

//   if (isLegal) {
//     let bod = getBod(str),
//       exp = getExp(str);

//     return function () {
//       // 把这些匿名函数的this绑定到这个函数
//       let getVal = (a) => (typeof a === "string" ? eval(a) : a);
//       let apply = (a, b) => getVal(a)(getVal(b));
//       let lcApply = (arr) => {
//         arr = arr.map((val) => (Array.isArray(val) ? lcApply(val) : val));

//         while (arr.length > 1) {
//           arr[1] = apply(arr[0], arr[1]);
//           arr.shift();
//         }
//         return arr[0];
//       };
//       let split = (str) => {
//         if (isLegal(str)) return [lc2js(str)];
//         let arr = [];
//         let temp = "",
//           count = 0;

//         for (let c of str) {
//           if (c === " ") {
//             if (temp.length && count == 0) {
//               arr.push(temp);
//               temp = "";
//             } else temp += c;
//           } else if (c === "(") {
//             count++;
//             temp += c;
//           } else if (c === ")") {
//             count--;
//             temp += c;
//             if (count === 0) {
//               arr.push(split(temp.substr(1, temp.length - 2)));
//               temp = "";
//             }
//           } else temp += c;
//         }

//         if (temp.length) arr.push(temp);
//         return arr;
//       };
//       let lcEval = (str) => {
//         switch (typeof str) {
//           case "string":
//             return lcApply(split(str));
//           case "object":
//             return lcApply(str);
//           case "function":
//             return str;
//           default:
//             return () => str;
//         }
//       };

//       eval(`var ${bod} = ${arguments[0]}`);
//       return lcEval(exp);
//     };
//   }
//   return false;
// }

// let display = (x) => {
//   console.log(x);
//   return display;
// };

let add1 = (x) => x + 1;

// console.log(lc2js("lambda x . lambda y . add1 y")(10)(1));

// lambda x . lambda y . add1 y
var demoLc = {
  // 绑定的变量
  val: ["x"],
  // 表达式
  bod: [{ val: ["y"], bod: ["add1", "y"] }],
  // 祖先
  par: null,
};

// lambda f . (lambda x . f (lambda v . x x v)) (lambda x . f (lambda v . x x v))
var Z = {
    val: ["f"],
    bod: [
      {
        val: ["x"],
        bod: [
          "f",
          {
            val: ["f"],
            bod: ["x", "x", "f"],
          },
        ],
      },
      {
        val: ["x"],
        bod: [
          "f",
          {
            val: ["v"],
            bod: ["x", "x", "v"],
          },
        ],
      },
    ],
  },
  Y = {
    val: ["f"],
    bod: [
      { val: ["x"], bod: ["f", ["x", "x"]] },
      { val: ["x"], bod: ["f", ["x", "x"]] },
    ],
  };

function lc2fn(lcObj) {
  let getVal = (s) => {
    let obj = lcObj;
    while (obj && obj.valBind[s] === undefined) obj = obj.par;
    if (obj) return obj.valBind[s];
    return eval(s);
  };
  let getAllVal = (arr) => {
    if (Array.isArray(arr)) {
      return arr.map((i) => {
        if (Array.isArray(i)) return getAllVal(i);
        switch (typeof i) {
          case "string":
            return getVal(i);
          case "object":
            i.par = lcObj;
            return lc2fn(i);
          default:
            return i;
        }
      });
    } else return arr;
  };
  let apply = (arr) => {
    if (Array.isArray(arr)) {
      arr = arr.map((i) => (Array.isArray(i) ? apply(i) : i));
      while (arr.length > 1) {
        arr[1] = arr[0](arr[1]);
        arr.shift();
      }
      return arr;
    } else return arr;
  };

  return function () {
    lcObj.valBind = {};
    lcObj.valBind[lcObj.val[0]] = arguments[0];
    lcObj.bod = apply(getAllVal(lcObj.bod));
    //console.log(lcObj, "\n");
    return lcObj.bod[0];
  };
}

let fact = (r) => (n) => {
  console.log(r, n);
  if (n == 1) return 1;
  return n * r(n - 1);
};

console.log(lc2fn(Z)(fact)(3));
