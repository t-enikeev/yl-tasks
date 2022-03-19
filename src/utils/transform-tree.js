const findRecurse = (item, deep = 0) => {
  if (item.isDeleted === true) {
    if (item.children == true) {
      for (let i in item.children) {
        console.log("i", item.children[i]);
        if (findRecurse(item.children[i], deep++) === true) {
          console.log("find in", deep);
          return true;
        }
      }
    } else {
      return false;
    }
  } else {
    return true;
  }
};

export const makeTree = (array) => {
  const arr = array
    .reduce((acc, curr) => {
      curr.children = array.filter((item) => {
        console.log(findRecurse(item));
        if (item.parent?._id === curr._id) {
          return true;
        }
      });
      acc.push(curr);
      return acc;
    }, [])
    .filter((item) => {
      return item.parent?._type === "article";
    });
  return arr;
};

export const findInTreeAndAddChild = (array, parentId, dataForUpdate) => {
  return array.map((item) => {
    if (item._id !== parentId) {
      if (item.children) {
        return { ...item, children: findInTreeAndAddChild(item.children, parentId, dataForUpdate) };
      } else {
        return item;
      }
    } else {
      const newItem = { ...item, children: [...item.children, dataForUpdate] };
      return newItem;
    }
  });
};

export const findInTreeAndPatch = (array, searchId, dataForUpdate) => {
  return array.map((item) => {
    if (item._id !== searchId) {
      if (item.children) {
        return { ...item, children: findInTreeAndPatch(item.children, parentId, dataForUpdate) };
      } else {
        return item;
      }
    } else {
      const newItem = { ...item, ...dataForUpdate };
      return newItem;
    }
  });
};

// export const findInTreeAndRemove = (array, searchId) => {
//   return array.map((item) => {
//     if (item._id !== searchId) {
//       if (item.children) {
//         return { ...item, children: findInTreeAndRemove(item.children, parentId, dataForUpdate) };
//       } else {
//         return item;
//       }
//     } else {
//       const newItem = { ...item, ...dataForUpdate };
//       return newItem;
//     }
//   });
// };
