# OT 算法

## 问题背景

多人共同编辑文档。

举个栗子：
文档初始化内容：“hello world”
A修改成：“hi world"      “hello” 改为 “hi”
B修改成：“hello worlds”  “world” 改为 “worlds”
最终展现结果 “hi worlds”

## 算法思路

这部分，我们会讲解 easysync 的算法思想，是如何解决如上的两个协同冲突问题的。首先，我们需要简单定义一些关键的数据结构。请注意 easysync 算法并不给定这些数据结构的详细格式，只是给定了这些数据结构的一些限制，只要满足限制都是可以用作 easysync 的数据结构。​

### Document（文档）:

​一个文档是一个字符列表，或者一个字符串​一个文档也可以被一系列 changeset 表示​计算 X' = f(B, X)。​证：由于X 和 B 都是基于 A 的修改， 按照 Follow 算法的定义，X'应当为 B 基于 A Follow 后的结果，有ABX' = AXB'，故 X' = f(B, X)，B' = f(X, B)​计算 Y' = f(f(X, B), Y)。​证： ​由1、2可知，A'X'  = ABX' = AXB'，​由于文档原内容为 AXY，可知Y和 B'都是基于 AX的修改，故按照 Follow 算法的定义， Y' 应为 B' 基于 AX Follow 后的结果，即  AXYB'' = AXB' Y' ，Y' = f(B', Y)。​由2中可知 B' = f(X, B)，故 Y' = f(f(X,B), Y)。​计算D = f(Y, f(X, B))。​证：​因为 AXYD = A'X'Y' 。将1、2、3计算的结果代入，可得 AXYD = A • B• f(B,X) • f(f(X,B),Y)​按照 Follow 算法的定义，应有ABf(B,X) = AXf(X,B)。故上式可划为，A • X• f(X,B) • f(f(X,B),Y)​设 S = f(X,B)， 则上式可化为 AXSf(S,Y)，继续按照 Follow 算法的定义，则有 AXSf(S,Y) = AXYf(Y,S)。将 S 代回，可得 A • X • Y • f(Y, f(X,B)).​故 AXYD = A • B• f(B,X) • f(f(X,B),Y)  ​= A • X• f(X,B) • f(f(X,B),Y)​    = A • X • Y • f(Y, f(X,B))​可得 D = f(Y, f(X,B))​当收到其他客户端提交的 changeset B 时，客户端按照如上的计算公式，分布计算出 A'X'Y'和 D，将 D 作用于当前展示的数据，得到新的展示。将A'X'Y'替换 AXY 作为新的 AXY 模型。​​接收changeset发现本地版本过低​在上述处理接收的其他客户端的 changeset  B 的时，我们定义本地状态为 AXY。但是上述过程的推导，基于的一个前提是 B 和 X 都是基于 A 的变更。如果客户端收到了一个 B，发现B 是基于比 A 更新的版本的变更（中间的变更数据可能因为网络原因没有收到），这时客户端可以按照如下的步骤进行处理：​通过服务端的 FetchMiss 接口，将缺失的 changeset 拉回来。(即A.Version < cs.Version < B.Version中的 cs)​从低到高版本，挨个按照上述接收其他客户端提交的 changesets的流程处理，直到 A 被更新到最新的状态，即：X 和 B 都是基于 A 进行变更的状态。

### changeset

### follow 算法

### apply 算法

## 算法实现

## 参考

- [easysync协同算法详解](https://bytedance.feishu.cn/docs/doccnzsFhrH5G30YMPPwCJCURp9#UFV0bn)
- [ot.js](https://github.com/Operational-Transformation/ot.js)
