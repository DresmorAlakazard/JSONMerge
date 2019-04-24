var oMerge = new JSONMerge();

var oItem1 = {
  simpleValue1: 666,
  simpleValue2: "hi",
  simpleArray1: [ 1, 2, 3, 4 ],
  simpleArray2: [ { value: 1 }, { value: 2 }, { value: 3 } ],
  simpleObject1: { value: 1 },
  simpleObject2: { value: { value: "?" } }
};

var oItem2 = {
  simpleValue1: 66,
  simpleValue2: "hi asdasd",
  simpleArray1: [ 1, 2, 10, 4 ],
  simpleArray2: [ { value: 1 }, [ 2 ], { value: 3 } ], // changed
  simpleObject1: { value: 1 },
  simpleObject2: [ { value: "?" } ] // changed
};

oMerge.compare(
  oItem1,
  oItem2
);

oMerge.execute();