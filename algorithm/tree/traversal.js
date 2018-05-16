const depthFirst = order => rootNode => {
  const records = [];
  let r;

  const rLeft = node => node.left && r(node.left);
  const rRight = node => node.right && r(node.right);
  const record = node => records.push(node.name);

  if (order === 'pre') r = node => { record(node); rLeft(node); rRight(node) };
  if (order === 'in') r = node => { rLeft(node); record(node); rRight(node) };
  if (order === 'post') r = node => { rLeft(node); rRight(node); record(node); };

  r(rootNode);
  return records;
}

function breadthFirst(rootNode) {
  const records = [];
  const queue = [];
  let index = 0;

  queue.push(rootNode);

  while (index < queue.length) {
    let node = queue[index];
    records.push(node.name);

    if (node.left) {
      queue.push(node.left);
    }

    if (node.right) {
      queue.push(node.right);
    }

    index++;
  }

  return records;
}

module.exports = {
  depthFirst,
  breadthFirst,
}
