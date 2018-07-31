# 页面布局

## 盒模型

在文档中每一个元素都是一个盒子。盒子的大小由外边框，边框，内边框，内容宽度决定。
盒子宽度默认 = width + 左右border + 左右padding + 左右margin

### # box-sizing

box-sizing 定义了 width 包含该盒模型那些部分。一共有3个取值，content-box, border-box, inherit。

- content-box: width = content, width 只包含 content 占用的区域，即默认的盒模型。
- border-box: width = content + padding + border。
- inhrit: 继承父元素的值。

### # margin重叠

当一个元素在另一个元素上面时，上面元素的底边外边框和下面元素的顶外边框会发生叠加

## normal flow（普通流/常规流/文档流）

网页中流指文档中的内容读取和展示的顺序，默认情况下，文档中元素依照从上到下，从左到右的顺序排列。

元素大多为块级元素和行内元素，块级元素前后会带有换行符号，表现形式为占用整行。Html 中的块级元素：

	<div>   <h1><h2><h3><h4><h5><h6>  <hr>  <ol>  <ul>  <form>  <p>  <table>  
	<video>  <audio>  <canvas>  <pre>  <header>  <footer>  <article>  <output>
	<aside>  <blockquote>  <dd>  <dl>  <figcaption>   <figure>  <hgroup>  <section>  <tfoot>

行内元素只占用它对应标签的边框所占用的空间。Html 中的行内元素有 span, a, li 等

## 定位 postion

定义元素位于何处，及其对周围元素的影响。

- static<默认值>: 保持其在普通流中的位置。不能被 left, right, top, bottom, z-index影响。
- relative: 相对定位。位置相对于文档流中的位置移动，移动距离由 left, right, top, bottom 定义。
- absolute: 绝对定位。元素脱离文档流，相对于最近的确定的元素定位（通常定义该父元素的 postation: relative），默认位于左上，由 left, right, top, bottom 决定位置。
- fix: 相对于窗口定位，不会受页面滚动影响，

## 显示 dispaly 

定义元素生产的框的类型。

- none: 元素不显示，不占用普通流（不同于visibility)。
- block: 块级框。和块级元素同样的表现形式。
- inline: 行内框。和行内元素有相同的表现形式，其宽度就是其包含的文字或图片的宽度，不能被 wight, height, margin-top, margin-bottom 改变。
- inline-block: 除了没有换行符，其他和 block 一样。
- list-item: 表现形式类似于 list item，和 block 不同于，其前面有小圆点。
- table: 表现形式类似于 table，元素的内容和子元素表现形式类似于 table cell。
- table-cell: 表现形式类似于 table cell。
- table-row: 表现形式类似于 table row。
- flex: 把该元素变成一个 flexbox container，表现形式和 block 一样。
- inline-flex: 把该元素拥有 inline 和 flexbox 的属性，该元素是一个 flexbox container，表现形似类似于 inline。

## 浮动 float

元素会脱离文档，向左或右移动，直到它的外边缘碰到包含框或另一个浮动框的边框为止。

## 屏幕自适应/响应式布局

随着移动互联网的普及，越来越多的移动设备成为访问终端，为了保证不同设备上具有相同的显示效果，提出了一下几种方案。

### #浏览器自动调整宽度

使用 meta 标签

    　　<meta name="viewport" content="width=device-width, initial-scale=1" />

viewport 是网页默认的宽度和高度，width=device-width 表示网页宽度和设备宽度一样，initial-scale=1 表示缩放程度为1。

### #使用 rem

传统的 em 指相对于父元素的 font-size，而 rem 是相对于根元素的 font-size。如果所有的元素都使用 rem ，则可以通过在不同设备上修改根元素的 font-size 实现响应式布局。

### #媒体查询

媒体查询有一个可选的媒体类型和由多个媒体属性组成的媒体查询组成，当媒体查询为真时使用对应样式。

可以使用 and / not / only 关键字。and 可以合并多条媒体属性组成一条媒体查询，逗号分隔效果则相对于 or，not 和 only 作用于整个媒体查询，not 对媒体查询的结果取反，only 用于兼容老浏览器，当使用 not 或者 only 时，必须制定一个媒体类型。

使用 @media 在不同屏幕大小下使用不同的样式

	// 只有设备宽度在 480px 到 960 px之间才使用以下样式
	@media only screen 
		and (max-device-width: 960px)
		and (min-device-width: 480px)
	{
		html{
			font-size: 14px;
		}
	}

	// 等同于 @media not ( screen and (max-device-height: 300px) ), 当高度小于 300px 时不使用以下样式
	@media not screen
		and (max-device-height: 300px;)
	{
		html{
			font-size: 14px;
		}
	}

	// 当设备高度小于 300px 或者设备宽度 小于 480px 时使用以下样式
	@media (max-device-height: 300px),
		screen and (max-device-width: 480px)
	{
		...
	}

## 弹性盒子模型

弹性盒子是一种新提出布局方案。它定义了一个弹性容器，容器里第一层级的子元素如何排列，和如何使用容器剩余空间。

传统页面布局常常需要开发者声明元素大小，而弹性盒子只需声明其容器内元素的排列方式，大小由浏览器计算得出，可以自动适应不同的屏幕大小，可以用于响应式布局开发。

![弹性盒子模型](https://mdn.mozillademos.org/files/12998/flexbox.png)

弹性容器主要有2根轴，主轴和侧轴，元素沿着主轴排列，在侧轴上调整位置，默认主轴为水平，侧轴为垂直。

基本

- display: flex | inline-flex;  定义一个弹性容器，其子元素为弹性项目（flex item）
- flex-direction: row<默认> | row-reverse | column | column-reverse;  定义主轴的方向是水平从左到右，水平翻转从右到左，垂直从上到下，垂直翻转从下到上
- justify-content: flex-start<默认> | flex-end | center | space-between | space-around;  定义主轴上元素如何排列。
- align-items: flex-start | flex-end | center | baseline | stretch;  定义侧轴上元素如何排列 

弹性项目属性

- align-self: auto<默认> | flex-start | flex-end | center | baseline | stretch;  类似于 align-items，其规则只作用于该元素
- flex-basis: auto<默认> |  80px<长度>;   定义该元素初始化时占据的主轴空间
- order: 0<默认> | -1 | 1 ~ infinity;  定义该元素在主轴上的排列顺序。
- flex-grow: 0<默认> | -1 | 1 ~ infinity;  定义当有剩余空间时该元素如何扩展。
- flex-shrink: 1<默认> | 0 | 2 ~ infinity;  定义当空间不足时该元素如何收缩。

其他

- flex-wrap: nowrap<默认> | wrap | wrap-reverse;  定义弹性项目是否换行。
- align-content: stretch<默认> | flex-start | flex-end | center | space-between | space-around;  定义了多根轴线时的对其方式。

## 网格布局 grid

## Ref

- [块级元素(MDN)](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Block-level_elements)
- [cssreference.io](http://cssreference.io/.io)
- [box-sizing](http://cssreference.io/property/box-sizing/)
- [flex box model](http://cssreference.io/flexbox/)
- [使用弹性盒子进行高级布局](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Flexible_Box_Layout/Using_CSS_flexible_boxes)
- [Flex 布局教程](http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html)
- [CSS布局十八般武艺都在这里了](https://zhuanlan.zhihu.com/p/25565751)
- [自适应网页设计](http://www.ruanyifeng.com/blog/2012/05/responsive_web_design.html)
- [@media](https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Media_queries)