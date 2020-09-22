export default {
  // Labels
  'Activate the global connect tool': '启动全局连接工具',
  'Append {type}': '追加 {type}',
  'Add Lane above': '添加到通道之上',
  'Divide into two Lanes': '分成两条通道',
  'Divide into three Lanes': '分成三条通道',
  'Add Lane below': '添加到通道之下',
  'Append compensation activity': '追加补偿活动',
  'Change type': '更改类型',
  'Connect using Association': '文本关联',
  'Connect using Sequence/MessageFlow or Association': '消息关联',
  'Connect using DataInputAssociation': '数据关联',
  'Remove': '移除',
  'Activate the hand tool': '启动手动工具',
  'Activate the lasso tool': '启动 Lasso 工具',
  'Activate the create/remove space tool': '启动创建/删除空间工具',
  'Create expanded SubProcess': '创建可折叠子流程',
  'Create IntermediateThrowEvent/BoundaryEvent': '创建中间抛出/边界事件',
  'Create Pool/Participant': '创建池/参与者',
  'Parallel Multi Instance': '并行多实例',
  'Sequential Multi Instance': '串行多实例',
  'Loop': '循环',
  'Ad-hoc': 'Ad-hoc子流程',
  'Create {type}': '创建 {type}',
  'Task': '任务',
  'Send Task': '发送任务',
  'Receive Task': '接受任务',
  'User Task': '用户任务',
  'Manual Task': '手动任务',
  'Business Rule Task': '规则任务',
  'Service Task': '服务任务',
  'Script Task': '脚本任务',
  'Call Activity': '引用流程',
  'Sub Process (collapsed)': '可折叠子流程',
  'Sub Process (expanded)': '可展开子流程',
  'Start Event': '开始事件',
  'Intermediate Throw Event': '中间抛出事件',
  'End Event': '结束事件',
  'Message Start Event': '消息启动事件',
  'Timer Start Event': '定时启动事件',
  'Conditional Start Event': '条件启动事件',
  'Signal Start Event': '信号启动事件',
  'Error Start Event': '错误启动事件',
  'Escalation Start Event': '升级启动事件',
  'Compensation Start Event': '补偿启动事件',
  'Message Start Event (non-interrupting)': '消息启动事件 (非中断)',
  'Timer Start Event (non-interrupting)': '定时启动事件 (非中断)',
  'Conditional Start Event (non-interrupting)': '条件启动事件 (非中断)',
  'Signal Start Event (non-interrupting)': '信号启动事件 (非中断)',
  'Escalation Start Event (non-interrupting)': '升级启动事件 (非中断)',
  'Message Intermediate Catch Event': '中间消息捕获事件',
  'Message Intermediate Throw Event': '中间消息抛出事件',
  'Timer Intermediate Catch Event': '中间定时捕获事件',
  'Escalation Intermediate Throw Event': '中间升级抛出事件',
  'Conditional Intermediate Catch Event': '中间条件捕获事件',
  'Link Intermediate Catch Event': '中间链接捕获事件',
  'Link Intermediate Throw Event': '中间链接抛出事件',
  'Compensation Intermediate Throw Event': '中间补偿抛出事件',
  'Signal Intermediate Catch Event': '中间信号捕获事件',
  'Signal Intermediate Throw Event': '中间信号抛出事件',
  'Message End Event': '结束消息事件',
  'Escalation End Event': '结束升级事件',
  'Error End Event': '结束错误事件',
  'Cancel End Event': '结束取消事件',
  'Compensation End Event': '结束补偿事件',
  'Signal End Event': '结束信号事件',
  'Terminate End Event': '终止边界事件',
  'Message Boundary Event': '消息边界事件',
  'Message Boundary Event (non-interrupting)': '消息边界事件 (非中断)',
  'Timer Boundary Event': '定时边界事件',
  'Timer Boundary Event (non-interrupting)': '定时边界事件 (非中断)',
  'Escalation Boundary Event': '升级边界事件',
  'Escalation Boundary Event (non-interrupting)': '升级边界事件 (非中断)',
  'Conditional Boundary Event': '条件边界事件',
  'Conditional Boundary Event (non-interrupting)': '条件边界事件 (非中断)',
  'Error Boundary Event': '错误边界事件',
  'Cancel Boundary Event': '取消边界事件',
  'Signal Boundary Event': '信号边界事件',
  'Signal Boundary Event (non-interrupting)': '信号边界事件 (非中断)',
  'Compensation Boundary Event': '补偿边界事件',
  'Exclusive Gateway': '独占网关',
  'Parallel Gateway': '并行网关',
  'Inclusive Gateway': '包容网关',
  'Complex Gateway': '复杂网关',
  'Event based Gateway': '事件网关',
  'Transaction': '事务',
  'Sub Process': '子流程',
  'Event Sub Process': '事件子流程',
  'Collapsed Pool': '折叠池',
  'Expanded Pool': '展开池',
  // 补充
  'Append EndEvent': '追加结束节点',
  'Create EndEvent': '创建结束节点',
  'Append Intermediate/Boundary Event': '追加中间/边界节点',
  'Create Intermediate/Boundary Event': '创建中间/边界节点',
  'Create StartEvent': '创建开始节点',
  'Create Gateway': '创建网关',
  'Append Gateway': '追加网关',
  'TextAnnotation': '文本注释',
  'Append TextAnnotation': '追加文本注释',
  'Append Task': '追加任务',
  'Create Task': '创建任务',
  'Create DataObjectReference': '创建数据对象引用',
  'Append DataObjectReference': '追加数据对象引用',
  'Create DataStoreReference': '创建数据存储引用',
  'Append DataStoreReference': '追加数据存储引用',
  'Create Group': '创建群组',
  'Append Group': '追加群组',

  // Errors
  'no parent for {element} in {parent}': '在 {element} 中没有父元素 {parent}',
  'no shape type specified': '未指定形状类型',
  'flow elements must be children of pools/participants': '元素必须是池/参与者的子级',
  'out of bounds release': '越界释放',
  'more than {count} child lanes': '超过 {count} 条通道',
  'element required': '需要元素',
  'diagram not part of bpmn:Definitions': '图表不是 bpmn:Definitions 的一部分',
  'no diagram to display': '没有要显示的图表',
  'no process or collaboration to display': '没有可显示的流程或协作',
  'element {element} referenced by {referenced}#{property} not yet drawn': '元素 {element} 的引用 {referenced}#{property} 尚未绘制',
  'already rendered {element}': '{element} 已呈现',
  'failed to import {element}': '{element} 导入失败',
}
