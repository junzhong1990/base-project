<template>
  <el-form
      :label-position="direction"
      :label-width="labelWidth"
      ref="form"
      :model="form"
      :rules="rules"
      class="base-form"
      :disabled="disabled"
      :key="formKey"
  >
    <el-row v-for="(itemG, indexG) in formData" :key="indexG">
      <h2 class="title" v-if="itemG.groupName">{{itemG.groupName}}</h2>
      <el-col :span="colSpan" v-for="(item,index) in itemG.actDeModelFormList" :key="index">
        <el-form-item
            :label="(item.type == 'loadStationRate' || item.type == 'stationRight') ? '站点编号' : item.title"
            :prop="(item.type == 'loadStation' || item.type == 'loadNearestStation' || item.type == 'stationRight' || item.type == 'loadStationRate' || item.type === 'loadStopStation') ? 'stationCode' : (item.readOnly ? '' : item.prop)"
            :class="{'siding':item.type=='minMax'}"
            v-if="!item.destroy && item.type !== 'stationTransfer' && item.type !== 'gameCashItem' && item.type !=='gamePermissions' && item.type !=='gameTypeIssueNum' && item.type !=='newStationAgent' && item.type !=='storeGoodsList' && item.type !=='storeDamageGoodsList' && item.type !=='storeAllocationGoodsList' && item.type !=='trainUpload' && item.type !=='areaAdmin' && item.type !=='newStationGoodsList' && item.whetherShow"
        >
          <!-- 输入框 -->
          <el-input
              v-if="item.type=='input'"
              :disabled="item.readOnly?item.readOnly:false"
              v-model.trim="form[item.prop]"
              :placeholder="item.placeholder?`${item.placeholder}`:`请输入${item.title}`"
              :maxlength="item.maxlength"
              :onbeforepaste="item.onbeforepaste"
              :oninput="item.oninput"
              :class="item.class"
              show-word-limit
          ></el-input>
          <!-- 输入域-->
          <el-input
              v-if="item.type=='textarea'"
              v-model="form[item.prop]"
              type="textarea"
              :maxlength="item.maxlength?item.maxlength:'500'"
              :disabled="item.readOnly?item.readOnly:false"
              :autosize="{ minRows: 3, maxRows: 5}"
              :placeholder="item.placeholder?`${item.placeholder}`:`请输入${item.title}`"
          ></el-input>
          <!--活动区域-->
          <areaCheckbox :item="item" v-if="item.type=== 'areaCheckbox'" @areaCheckboxVauleBack="componentValueSet"></areaCheckbox>
          <!-- 下拉框 -->
          <!--单拉框-->
          <select-one :item="item" v-if="item.type=== 'select'" @selectVauleBack="componentValueSet" :allForm="form"></select-one>
          <!--          双输入框-->
          <input-two :item="item" v-if="item.type=== 'inputTwo' || item.type=== 'inputTwoLngLat'" @inputTwoValueBack="componentValueSet"></input-two>
          <!--双下拉框-->
          <select-two :item="item" v-if="item.type=== 'selectTwo'" @selectTwoVauleBack="componentValueSet"></select-two>
          <!--统计分析时间范围-->
          <date-query :item="item" v-if="item.type=== 'dateRangeFast' || item.type=== 'year'|| item.type=== 'month'" @getDateValue="componentValueSet"></date-query>
          <!--          统计分析多选框-->
          <check-box-all :item="item" v-if="item.type=== 'checkBoxAll'" @checkAllValueBack="componentValueSet"></check-box-all>
          <!--日期选择-->
          <el-date-picker
              v-if="item.type=='date'"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              v-model="form[item.prop]"
              type="date"
              :disabled="item.readOnly?item.readOnly:false"
              placeholder="选择日期">
          </el-date-picker>
          <!-- 起止日期选择 -->
          <el-date-picker
              type="daterange"
              v-if="item.type=='daterange'"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              v-model="form[item.prop]"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :disabled="item.readOnly?item.readOnly:false"
          ></el-date-picker>
          <!-- 单个时间选择 -->
          <el-date-picker
              type="datetime"
              :disabled="item.readOnly?item.readOnly:false"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              v-if="item.type=='datetime'"
              v-model="form[item.prop]"
          ></el-date-picker>
          <!-- 两个时间选择 -->
          <el-date-picker
              type="datetimerange"
              v-if="item.type=='datetimerange'"
              v-model="form[item.prop]"
              @change="changeTime(item)"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              :disabled="item.readOnly?item.readOnly:false"
          ></el-date-picker>
          <!--大额兑奖转款业务申请 -->
          <!--中奖彩票明细-->
          <div style="width: 900px;" v-if="item.type=='winDetail'">
            <el-table
                border stripe
                :data="form[item.prop]"
                style="width: 100%">
              <el-table-column label="序号" type="index" width="50"></el-table-column>
              <el-table-column
                  prop="gameId"
                  label="游戏类型"
                  width="180">
                <template slot-scope="scope">
                  <el-select @change="perListChange(form[item.prop], scope.$index)" v-model="scope.row.gameId" placeholder="请选择">
                    <el-option
                        v-for="item in $store.state.dicStore['misStationPermission.gameName']"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                  prop="lotteryStationCode"
                  label="站点编号"
                  width="180">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.lotteryStationCode" placeholder="请输入站点编号" @change="perListChange(form[item.prop], scope.$index)"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                  prop="gamePeriodNo"
                  label="期数">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.gamePeriodNo" placeholder="请输入期数" @change="perListChange(form[item.prop], scope.$index)"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                  prop="lineNumber"
                  label="流水号"
                  width="180">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.lineNumber" placeholder="请输入流水号" @change="perListChange(form[item.prop], scope.$index)"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                  prop="cashStationCode"
                  label="兑奖站号">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.cashStationCode" placeholder="请输入兑奖站号"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                  prop="amount"
                  label="中奖金额(元)">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.amount" disabled></el-input>
                </template>
              </el-table-column>
            </el-table>
            <div style="margin-top: 10px;">
              <el-button type="success" size="medium" @click="winDetailAdd(item.prop)">增加</el-button>
              <el-button type="danger" size="medium" @click="winDetailMi(item.prop)">减少</el-button>
            </div>
          </div>
          <!--建站，发放物品列表-->
          <div style="width: 900px;" v-if="item.type=='newStationGoods'">
            <el-table
                border stripe
                :data="form[item.prop]"
                style="width: 100%">
              <el-table-column label="序号" type="index" width="50"></el-table-column>
              <el-table-column
                  prop="goodsType"
                  label="物品类型"
                  width="180">
                <template slot-scope="scope">
                  <el-select @change="newStationGoodsChange1(scope.row)" v-model="scope.row.goodsType" placeholder="请选择物品类型" :disabled="item.readOnly?item.readOnly:false">
                    <el-option
                        v-for="item in scope.row.selectList1"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                  prop="goodsName"
                  label="物品名称"
                  width="180">
                <template slot-scope="scope">
                  <el-select @change="newStationGoodsChange2(scope.row)" v-model="scope.row.goodsName" placeholder="请选择物品名称" :disabled="item.readOnly?item.readOnly:false">
                    <el-option
                        v-for="item in scope.row.selectList2"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                  prop="dviceModel"
                  label="设备型号">
                <template slot-scope="scope">
                  <el-select  v-model="scope.row.dviceModel" placeholder="请选择设备型号" :disabled="item.readOnly?item.readOnly:false">
                    <el-option
                        v-for="item in scope.row.selectList3"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                  prop="goodsCount"
                  label="数量"
                  width="180">
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.goodsCount" placeholder="请输入数量" :disabled="item.readOnly?item.readOnly:false"></el-input>
                </template>
              </el-table-column>
            </el-table>
            <div style="margin-top: 10px;">
              <el-button type="success" size="medium" @click="newStationGoodsAdd(item.prop)">增加</el-button>
              <el-button type="danger" size="medium" @click="newStationGoodsMi(item.prop)">减少</el-button>
            </div>
          </div>
          <!-- 加载站点 -->
          <el-select v-if="item.type=='loadStation' " v-model="form[item.prop]" filterable remote :remote-method="getStationList"
                     @change="queryStationInfo">
            <el-option v-for="(station, index) in stationList"
                       :value="station.stationCode" :key="index"
                       :label="station.stationCode">
              {{station.stationCode}}-{{$common.getLabel($store.state.dicStore[station.stationStatusDic], station.stationStatus)}}-{{station.stationOwner}}
            </el-option>
          </el-select>
          <!-- 加载停机站点 -->
          <el-select v-if="item.type=='loadStopStation' " v-model="form[item.prop]" filterable remote :remote-method="getStopStationList"
                     @change="queryStationInfo">
            <el-option v-for="(station, index) in stationList"
                       :value="station.stationCode" :key="index"
                       :label="station.stationCode">
              {{station.stationCode}}-{{$common.getLabel($store.state.dicStore[station.stationStatusDic], station.stationStatus)}}-{{station.stationOwner}}
            </el-option>
          </el-select>
          <!-- 加载最近站点 nearestStation -->
          <el-select v-if="item.type=='loadNearestStation' " v-model="form[item.prop]" filterable remote :remote-method="getStationList"
                     @change="queryNearestStationInfo">
            <el-option v-for="(station, index) in stationList"
                       :value="station.stationCode" :key="index"
                       :label="station.stationCode">
              {{station.stationCode}}-{{$common.getLabel($store.state.dicStore[station.stationStatusDic], station.stationStatus)}}-{{station.stationOwner}}
            </el-option>
          </el-select>
          <!-- 站点销售费率 -->
          <el-select v-if="item.type=='loadStationRate' || item.type=='stationRight'" v-model="form.stationCode" filterable remote :remote-method="getStationList"
                     @change="queryStationInfo">
            <el-option v-for="(station, index) in stationList"
                       :value="station.stationCode" :key="index"
                       :label="station.stationCode">
              {{station.stationCode}}-{{$common.getLabel($store.state.dicStore[station.stationStatusDic], station.stationStatus)}}-{{station.stationOwner}}
            </el-option>
          </el-select>
          <!-- 级联选择 返回id-->
          <!--<cascader-one :item="item" v-if="item.type=== 'cascader'" @cascaderVauleBack="componentValueSet"></cascader-one>-->
          <CommonCascader
              v-if="item.type=== 'cascader'"
              :select_any_level_flag="true"
              :item="item"
              :qryObj="qryObjArea"
              :stage="3"
              ref="commonCascader"
              :res="form[item.prop]"
              @areaVauleBack="componentValueSet"
              :disabled="item.readOnly?item.readOnly:false"
          ></CommonCascader>
          <!--<el-cascader-->
              <!--v-if="item.type=='cascader'"-->
              <!--v-model="form[item.prop]"-->
              <!--:value="item.value"-->
              <!--:options="item.options"-->
              <!--:props="item.setProps"-->
              <!--:placeholder="item.placeholder?`${item.placeholder}`:`请选择${item.title}`"-->
              <!--:disabled="item.readOnly"-->
          <!--&gt;</el-cascader>-->
          <!-- 级联选择 返回对象-->
          <el-cascader
              v-if="item.type=='cascader-object'"
              v-model="form[item.prop]"
              :value="item"
              :options="item.options"
              :props="item.setProps"
              :disabled="item.readOnly?item.readOnly:false"
              :placeholder="item.placeholder?`${item.placeholder}`:`请选择${item.title}`"
          ></el-cascader>
          <!-- 级联选择（多选） -->
          <el-cascader
              v-if="item.type=='cascader-multiple'"
              v-model="form[item.prop]"
              :options="item.options"
              :props="item.setProps"
              :disabled="item.readOnly?item.readOnly:false"
              :placeholder="item.placeholder?`${item.placeholder}`:`请选择${item.title}`"
              clearable
          ></el-cascader>
          <!-- 单选 -->
          <el-radio-group
              v-if="item.type=='radio'"
              @change="changeRadio"
              v-model="form[item.prop]"
              :disabled="item.readOnly?item.readOnly:false"
          >
            <el-radio
                v-for="(list,index) in item.options"
                :key="index"
                :label="list.value"
            >{{list.label}}</el-radio>
          </el-radio-group>
          <!-- 上下排列的单选 带输入框 -->
          <div v-if="item.type=='radio-textarea'">
            <el-radio
                v-model="form[item.props[0]]"
                :label="item.options[0].value"
            >{{item.options[0].label}}</el-radio>
            <div class="flex-wrap">
              <el-radio
                  v-model="form[item.props[0]]"
                  :label="item.options[1].value"
              >{{item.options[1].label}}</el-radio>
              <el-input
                  v-model="form[item.props[1]]"
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4}"
                  :placeholder="item.placeholder?`${item.placeholder}`:`请选择${item.title}`"
              ></el-input>
            </div>
          </div>
          <!-- 地址栏 -->
          <CommonCascader
              v-if="item.type=='address'"
              :item="item"
              :select_any_level_flag="true"
              :qryObj="qryObjArea"
              :stage="3"
              ref="commonCascader"
              :res="form[item.prop]"
              @areaVauleBack="componentValueSet"
              :disabled="item.readOnly?item.readOnly:false"
          ></CommonCascader>
          <!--<div v-if="item.type=='address'">-->
            <!--&lt;!&ndash;<el-cascader&ndash;&gt;-->
                <!--&lt;!&ndash;v-model="form[item.prop]"&ndash;&gt;-->
                <!--&lt;!&ndash;:props="cascaderProps"&ndash;&gt;-->
                <!--&lt;!&ndash;@change="changeCity"&ndash;&gt;-->
                <!--&lt;!&ndash;:options="cityData"&ndash;&gt;-->
                <!--&lt;!&ndash;placeholder="请选择省、市、区"&ndash;&gt;-->
                <!--&lt;!&ndash;:key="cityKey"&ndash;&gt;-->
                <!--&lt;!&ndash;:disabled="item.readOnly?item.readOnly:false"&ndash;&gt;-->
            <!--&lt;!&ndash;&gt;</el-cascader>&ndash;&gt;-->
            <!--<CommonCascader-->
                <!--:item="item"-->
                <!--:select_any_level_flag="true"-->
                <!--:qryObj="qryObjArea"-->
                <!--:stage="3"-->
                <!--ref="commonCascader"-->
                <!--:res="form[item.prop]"-->
                <!--@areaVauleBack="componentValueSet"-->
                <!--:disabled="item.readOnly?item.readOnly:false"-->
            <!--&gt;</CommonCascader>-->
          <!--</div>-->
          <!-- 最大值最小值 -->
          <el-input
              v-if="item.type=='minMax'"
              v-model="form[item.options[0]]"
              @blur="checkNumber"
              type="text"
              placeholder="输入最小值"
              :disabled="item.readOnly?item.readOnly:false"
          ></el-input>
          <span v-if="item.type=='minMax'" class="siding-flag">至</span>
          <el-input
              v-if="item.type=='minMax'"
              v-model="form[item.options[1]]"
              @blur="checkNumber"
              type="text"
              placeholder="输入最大值"
              :disabled="item.readOnly?item.readOnly:false"
          ></el-input>
          <!-- 多选checkbox -->
          <el-checkbox-group
              v-if="item.type=='checkbox'"
              @change="changeCheckbox"
              v-model="form[item.prop]"
              :disabled="item.readOnly?item.readOnly:false"
          >
            <el-checkbox
                v-for="(list, index) in item.options"
                :key="index"
                :label="list.value"
            >{{list.label}}</el-checkbox>
          </el-checkbox-group>
          <ModalUpload v-if="item.type=='upload'" :backIds="item.value" @uploadResult="backFileId" :propName="item.prop" :type="['txt','doc','xls','xlsx','jpg','bmp','png','rar','zip']" :disabled="item.readOnly?item.readOnly:false" :isMultiple="true">
            <div slot="warnTxt">
              <p>提示：附件个数不能超过4个</p>
              <p>类型：可用文件格式 txt、doc、xls、jpg、bmp、png、rar、zip、office2007 其中的一种</p>
            </div>
          </ModalUpload>
          <!-- 培训课程题目选择 -->
          <div v-if="item.type=='trainCourseSelect'">
            <trainCourseSelect
                :item="item"
                @trainCourseSelectVauleBack="componentValueSet"
            ></trainCourseSelect>
          </div>
          <!-- 多个图片上传 -->
          <div v-if="item.type=='upload-drag'">
            <el-upload
                class="upload-demo"
                drag
                multiple
                action
                :limit="10"
                :show-file-list="true"
                :on-remove="handleRemove"
                :http-request="uploadFile"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将文件拖到此处，或
                <em>点击上传</em>
              </div>
              <!-- <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div> -->
            </el-upload>
          </div>
          <!--代销费率表-->
          <div style="width: 500px;" v-if="item.type=='newStationRate'">
            <el-table
                border stripe
                :data="form[item.prop]"
                style="width: 100%">
              <el-table-column label="序号" type="index" width="50"></el-table-column>
              <el-table-column
                  prop="gameName"
                  label="游戏"
                  width="180">
                <!--<template slot-scope="scope">-->
                  <!--<el-select v-model="scope.row.gameId" placeholder="请选择">-->
                    <!--<el-option-->
                        <!--v-for="item in gameTypeList"-->
                        <!--:key="item.value"-->
                        <!--:label="item.label"-->
                        <!--:value="item.value">-->
                    <!--</el-option>-->
                  <!--</el-select>-->
                <!--</template>-->
              </el-table-column>
              <el-table-column
                  prop="saleCommission"
                  label="代销费率">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.saleCommission" placeholder="请选择" :disabled="item.readOnly?item.readOnly:false">
                    <el-option
                        v-for="item in $store.state.dicStore['station.saleCommission']"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                  prop="saleCommissionFlag"
                  label="代销费率标志">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.saleCommissionFlag" placeholder="请选择" :disabled="item.readOnly?item.readOnly:false">
                    <el-option
                        v-for="item in $store.state.dicStore['station.saleCommissionFlag']"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!-- 建站设备列表 -->
          <div style="width:700px" v-if="item.type=='newStationDevice'">
            <stationDevice
                :data="form[item.prop] || []">
            </stationDevice>
          </div>
          <!-- 仓储采购入库物品列表 -->
          <!--<div style="width:700px" v-if="item.type=='storeGoodsList'">-->
            <!--<storeGoodsList-->
                <!--:data="form[item.prop] || []">-->
            <!--</storeGoodsList>-->
          <!--</div>-->
          <!-- 仓储报损物品列表 -->
          <!--<div style="width:700px" v-if="item.type=='storeDamageGoodsList'">-->
            <!--<storeDamageGoodsList-->
                <!--:item="item">-->
            <!--</storeDamageGoodsList>-->
          <!--</div>-->
        </el-form-item>
        <!--夜间销售权限- 根据站点获取游戏权限        -->
        <game-permissions :item="item" v-if="item.type=== 'gamePermissions'" @gamePermissionsValueBack="componentValueSet"></game-permissions>

        <!--          游戏兑奖金额权限业务申请-游戏原信息填充-->
        <game-cash-item :item="item" v-if="item.type=== 'gameCashItem'" @gameCashItemValueBack="componentValueSet" ></game-cash-item>

        <!--          站点新增 渠道选择 -->
        <new-station-agent :item="item" v-if="item.type=== 'newStationAgent'" @newStationAgentValueBack="componentValueSet" ></new-station-agent>

        <!--          仓储采购入库 报损申请 物品列表 -->
        <storeGoodsList :item="item" v-if="item.type=== 'storeGoodsList' || item.type=== 'storeDamageGoodsList' || item.type=== 'storeAllocationGoodsList'" @storeGoodsListValueBack="componentValueSet" ></storeGoodsList>
        <!--建站申请物品列表 -->
        <newStationGoodsList :item="item" v-if="item.type=== 'newStationGoodsList'" @newStationGoodsListValueBack="componentValueSet" ></newStationGoodsList>
        <!-- 网点新增  区域-区域经理联动 -->
        <areaAdmin :item="item" v-if="item.type=== 'areaAdmin'" @areaAdminValueBack="componentValueSet" ></areaAdmin>

        <!--          培训 课程 课件上传 -->
        <trainUpload :item="item" v-if="item.type=== 'trainUpload'" @trainUploadValueBack="componentValueSet" ></trainUpload>

        <!--          站点原址转让联动框-->
        <station-transfer :item="item" v-if="item.type=== 'stationTransfer'" @stationTransferValueBack="componentValueSet" @setRules="setNewRules"></station-transfer>
<!--        游戏类型游戏期号联动框-->
        <game-type-issue-num  :item="item" v-if="item.type=== 'gameTypeIssueNum'" @gameTypeIssueNumValueBack="componentValueSet" ></game-type-issue-num>
        <!--站点销售费率-游戏列表-->
        <el-form-item
            :label="item.title"
            :prop="item.readOnly ? '' : item.prop"
            :class="{'siding':item.type=='minMax'}"
            v-if="!item.destroy && item.type=='loadStationRate'"
        >
          <div style="width: 700px;">
            <el-table
                border stripe
                :data="form[item.prop]"
                style="width: 100%">
              <el-table-column label="序号" type="index" width="50"></el-table-column>
              <el-table-column
                  prop="gameId"
                  label="游戏"
                  width="180">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.gameId" placeholder="请选择" disabled>
                    <el-option
                        v-for="item in $store.state.dicStore['misStationPermission.gameName']"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                  prop="gameCommissionFee"
                  label="原代销费率"
                  width="180">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.gameCommissionFee" placeholder="请选择" disabled>
                    <el-option
                        v-for="item in $store.state.dicStore['station.saleCommission']"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                  prop="newSaleCommission"
                  label="现代销费率">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.newSaleCommission" placeholder="请选择">
                    <el-option
                        v-for="item in $store.state.dicStore['station.saleCommission']"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-form-item>
        <!--加载站点销售权限-游戏列表-->
        <el-form-item
            :label="item.title"
            :prop="item.readOnly ? '' : item.prop"
            :class="{'siding':item.type=='minMax'}"
            v-if="!item.destroy && item.type=='stationRight'"
        >
          <div style="width: 700px;">
            <el-table
                border stripe
                :data="form[item.prop]"
                style="width: 100%">
              <el-table-column label="序号" type="index" width="50"></el-table-column>
              <el-table-column
                  prop="gameId"
                  label="游戏"
                  width="180">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.gameId" placeholder="请选择" @change="stationRightGameChange(form[item.prop], scope.$index)" disabled>
                    <el-option
                        v-for="item in $store.state.dicStore['misStationPermission.gameName']"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                  prop="wager"
                  label="投注权限"
                  width="180">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.wager" placeholder="请选择">
                    <el-option
                        v-for="item in $store.state.dicStore.allowBan"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                  prop="cancel"
                  label="注销权限">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.cancel" placeholder="请选择">
                    <el-option
                        v-for="item in $store.state.dicStore.allowBan"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                  prop="cash"
                  label="兑奖权限">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.cash" placeholder="请选择">
                    <el-option
                        v-for="item in $store.state.dicStore.allowBan"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-form-item>
        <!--大额兑奖转款业务申请 -->
        <el-form-item
            :label="'转账总金额'"
            :prop="item.readOnly ? '' : item.prop"
            v-if="!item.destroy && item.type=='winDetail'"
        >
          <el-input v-model="form.transferSumAmount" disabled></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="colSpan">
        <!-- 按钮组 -->
        <slot name="formButton"></slot>
      </el-col>
    </el-row>
    <!-- 提供自定义或者比较复杂的逻辑表单插槽 -->
    <slot name="exForm"></slot>
  </el-form>
</template>

<script>
  import moment from 'moment'
  // import cityData from '@/libs/map/area.json'
  import cascaderOne from './cascaderOne'
  import selectOne from './selectOne'
  import selectTwo from './selectTwo'
  import inputTwo from './inputTwo'
  import stationTransfer from './stationTransfer'
  import gameCashItem from './gameCashItem'

  import stationDevice from './stationDevice'
  import DateQuery from './dateQuery'
  import CheckBoxAll from './checkBoxAll'
  import gameTypeIssueNum from './gameTypeIssueNum'
  import gamePermissions from './gamePermissions'
  import newStationAgent from './newStationAgent'
  import storeGoodsList from './storeGoodsList'
  import storeDamageGoodsList from './storeDamageGoodsList'
  import trainUpload from './trainUpload'
  import trainCourseSelect from './trainCourseSelect'
  import areaCheckbox from './areaCheckbox'
  import areaAdmin from './areaAdmin'
  import newStationGoodsList from './newStationGoodsList'

  export default {
    name: '',
    components: {
      cascaderOne,
      selectOne,
      selectTwo,
      inputTwo,
      stationDevice,
      DateQuery,
      CheckBoxAll,
      stationTransfer,
      gameTypeIssueNum,
      gamePermissions,
      gameCashItem,
      newStationAgent,
      storeGoodsList,
      storeDamageGoodsList,
      trainUpload,
      trainCourseSelect,
      areaCheckbox,
      areaAdmin,
      newStationGoodsList
    },
    props: {
      formKey: {
        type: Number,
        default: 0
      },
      formData: {
        type: Array,
        default() {
          return [];
        }
      },
      rules: {
        type: Object,
        default: {}
      },
      direction: {
        type: String,
        default: 'right'
      },
      flowKey: {
        //流程 id
        type: String,
        default: ''
      },
      labelWidth: {
        type: String,
        default: '140px'
      },
      disabled: {
        type: Boolean,
        default: false
      },
      colSpan: {
        type: Number,
        default: 24
      }
    },
    data() {
      return {
        checkboxprops: [],
        qryObjArea: {
          apiCode: 'sysRegion',
          content: {
            status: 1
          }
        },
        gameTypeList: this.$store.state.dicStore['misStationPermission.gameName'],
        // 站点编号集合
        stationList: [],
        stationTableData: [],
        cityKey: 1,
        cityData: [],
        citySelect: '',
        cascaderProps: {
          label: 'name',
          value: 'code',
          children: 'children'
        },
        form: {},
        radioValue: '',
        radioParam: {}, // 用于保存radio的参数
        switchText: '开启',
        dateParam: {}, // 用于保存起止日期的参数
        timeParam: {}, // 用于保存起止时间的参数
        selectParam: {}, // 用于保存起止时间的参数
        cascaderParams: {}, // 用于保存级联选择器（多选）的参数
        cascaderParam: {}, // 用于保存级联选择器（单选）的参数
        imageUrl: ''
      };
    },
    watch: {
      form: {
        handler(newValue, oldValue) {
          console.log(newValue)
          let param = JSON.parse(JSON.stringify(newValue));
          // console.log('newValue', newValue)
          // 用于保存级联选择器
          // for (let key in this.cascaderParams) {
          //   if (param[key] && param[key].length > 0) {
          //     for (let i = 0; i < param[key].length; i++) {
          //       param[key][i] = param[key][i][param[key][i].length - 1];
          //     }
          //   }
          // }
          // for (let key in this.cascaderParam) {
          //   if (param[key] && param[key].length > 0) {
          //     param[key] = param[key][param[key].length - 1];
          //   }
          // }
          // console.log('param', param)
          this.checkboxprops.forEach((val) => {
            if (param[val].length > 0) {
              setTimeout(() => {
                this.clearValidate(val)
              }, 10)
            }
          })
          this.$emit('change', param);
          this.cityKey++
        },
        // 深度监听 监听对象，数组的变化
        deep: true
      },
      formData: {
        handler(newValue, oldValue) {
          console.log(newValue)
          // this.form = {};
          this.init(newValue);
        },
        // 深度监听 监听对象，数组的变化
        deep: true
      }
    },
    created() {
      // console.log(this.formData)
      this.init(this.formData);
    },
    beforeMount() {
      this.cityData = JSON.parse(sessionStorage.getItem('area'))
    },
    methods: {
      // findCheckboxProps() {
      //   let arr = []
      //   this.formData.forEach((val, i) => {
      //     val.actDeModelFormList.forEach((val1, i) => {
      //       if (val1.required == true && (val1.type == 'checkbox' || val1.type == 'newStationGoods' || val1.type == 'daterange')) {
      //         arr.push(val1.prop)
      //       }
      //     })
      //   })
      //   this.checkboxprops = arr
      // },
      clearCheckboxV() {
        // this.checkboxprops.forEach((val, i) => {
        //   setTimeout(() => {
        //     this.clearValidate(val)
        //   }, 10)
        // })
      },
      // 站点原址转让联动框添加规则
      setNewRules(flag, rule) {
        if (flag === 'add') {
          this.rules = Object.assign(this.rules, rule)
        } else if (flag === 'delete') {
          delete this.rules[rule]
        }
        // console.log('设置新规则', this.rules)

      },
      commonSelectAreaResult(val, name, res) {
        // console.log(val, name, res)
      },
      // 从组建返回的值，obj是组件返回的对象，prop参数是对应的字段
      async componentValueSet(obj, prop) {
        // 假如是课程修改，下拉选择，请求详情
        if (prop == 'id') {
          const res = await this.$api.trainCourseGet({ data: { id: obj['id'] }})
          let resD = res.data
          let fileIdArr = []
          resD.filFileVos.forEach((val, i) => {
            fileIdArr.push(val.id)
          })
          let questionIdsArr = []
          resD.questionBankManageVos.forEach((val, i) => {
            questionIdsArr.push(val.id)
          })
          this.$set(obj, 'courseName', resD.trainCourse.courseName);
          this.$set(obj, 'courseTypeId', resD.trainCourse.courseTypeId +'');
          this.$set(obj, 'fileType', resD.trainCourse.fileType);
          this.eventBus.$emit('fileType', resD.trainCourse.fileType)
          this.$set(obj, 'fileUpload', fileIdArr.join(','));
          this.eventBus.$emit('fileUpload', fileIdArr.join(','))
          this.$set(obj, 'questionIds', questionIdsArr.join(','));
          this.$set(obj, 'singleScore', resD.trainCourse.singleScore);
          this.$set(obj, 'courceContent', resD.trainCourse.courceContent);
          this.eventBus.$emit('trainCourse', questionIdsArr.join(','), resD.trainCourse.singleScore)
        }
        // 假如是课程新增， 选择题目，判断ids  有ids  就清除空校验
        if (prop == 'questionIds' && obj['questionIds'].length > 0) {
          this.$refs.form.clearValidate(['questionIds'])
        }
        // Object.keys(obj).forEach((prop) => {
        //   // this.$set(this.form, prop, obj[prop]);
        //   this.form[prop] = obj[prop]
        // })
        setTimeout(() => {
          Object.keys(obj).forEach((prop) => {
            // this.$set(this.form, prop, obj[prop]);
            this.form[prop] = obj[prop]
          })
          // 清空有值的校验 bug
          for(var i in this.form) {
            if ( !this.rules[i] ) return
            if (this.form[i].length > 0 && (this.rules[i][0].required == true || this.rules[i][1].required == true) && (this.rules[i][0].validator.name == 'specialRequire' || this.rules[i][1].validator.name == 'specialRequire')) {
              this.clearValidate(i)
            }
          }
        }, 10)
      },
      // 中奖彩票明细
      async stationRightGameChange(list, index) {
        // 设置gameName
        if (list[index].gameId) {
          list[index].gameName = this.$common.getLabel(this.gameTypeList, list[index].gameId)
        }
      },
      // 中奖彩票明细
      async perListChange(list, index) {
        // console.log(list)
        // 设置gameName
        if (list[index].gameId) {
          list[index].gameName = this.$common.getLabel(this.gameTypeList, list[index].gameId)
        }
        // 转账总金额
        if (!this.form.transferSumAmount) {
          this.$set(this.form, 'transferSumAmount', 0)
        }
        let data = {
          ticketStationId: list[index].lotteryStationCode,
          issue: list[index].gamePeriodNo,
          tsn: list[index].lineNumber,
          gameId: list[index].gameId
        }
        if (data.ticketStationId && data.issue && data.tsn && data.gameId) {
          // console.log(12)
        } else {
          return
        }
        let res = await this.$api.getLotteryPrice({  data })
        if (res.code != 0) return
        this.$set(list[index], 'amount', res.data)
        let num = 0
        list.forEach((val, i) => {
          num = num + (val.amount * 1)
        })
        this.$set(this.form, 'transferSumAmount', num)
      },
      winDetailAdd(prop) {
        // console.log('增加')
        let arr = JSON.parse(JSON.stringify(this.form[prop]))
        arr.push({})
        this.$set(this.form, prop, arr)
      },
      winDetailMi(prop) {
        this.form[prop].pop()
        // console.log('减少')
      },
      newStationGoodsAdd(prop) {
        // console.log('增加')
        let arr = JSON.parse(JSON.stringify(this.form[prop]))
        arr.push({
          selectList1: this.$store.state.dicStore['station.IssueGoods'],
          selectList2: [],
          selectList3: []
        })
        this.$set(this.form, prop, arr)
      },
      newStationGoodsMi(prop) {
        this.form[prop].pop()
        // console.log('减少')
      },
      // 新增站点-物品列表 改变
      async newStationGoodsChange1(item) {
        item.selectList2 = item.selectList1.find((val => val.value === item.goodsType)).children
        // console.log(item)
        this.$set(item, 'goodsName', '')
        this.$set(item, 'dviceModel', '')
      },
      async newStationGoodsChange2(item) {
        item.selectList3 = item.selectList2.find((val => val.value === item.goodsName)).children
        this.$set(item, 'dviceModel', '')
        // console.log(item)
      },
      // 根据最近投注站站点编号查询站点类别信息
      async queryNearestStationInfo(val) {
        if (!val) return
        let data = {
          stationCode: val
        }
        let res = await this.$api.queryStationAllInfoByCode({ data })
        if (res && res.code == 0) {
          this.$set(this.form, 'nearestStationCategory', res.data.stationCategory)
          // console.log('根据最近投注站站点编号查询站点类别信息', res.data.stationCategory)

        }
      },
      // 根据站点编号查询站点所有信息
      async queryStationInfo(val) {
        if (!val) return
        let data = {
          stationCode: val
        }
        let res
        let apiStr = this.$route.query.flowKey == 'temporary_lines' ? 'getCreditLimit' : 'queryStationAllInfoByCode'
        res = await this.$api[apiStr]({ data })
        if (res && res.code == 0) {
          let resData = res.data
          // console.log('站点信息', this.form)
          // 将站点信息中对象数据暴露到上层
          for(let key  in resData){
            if (resData[key].constructor === Object) {
              let keyArr = Object.keys(resData[key])
              let valueArr = Object.values(resData[key])
              keyArr.forEach((val, i) => {
                resData[key + '_' + val] = valueArr[i]
              })
            }
          }
          Object.assign(this.form, resData)
          Object.keys(resData).forEach(key => {
            // 数字改成字符串
            if (typeof this.form[key] === 'number' && !isNaN(this.form[key])) {
              this.form[key] = this.form[key] + ''
            }
            let value = this.form[key]
            let newKey = key + 'Old'
            this.$set(this.form, newKey, '')
            this.form[newKey] = value
            // this.$set(this.form, newKey, value)
          })
          console.log(this.form)
          // this.stationList = resData
        }
        // 网点信息变更 经纬度回填
        if (this.flowKey === 'station_info_change_apply') {
          this.eventBus.$emit('lnglat', this.form.stationLng, this.form.stationLat)
        }
        if (this.flowKey === 'gameCashmyProcess' || this.flowKey === 'udcompent') {
          /*
          *
          * 游戏兑奖金额权限业务申请
          * 游戏名称下拉框来源于站点信息的stationPermission,gameId,gameName
          * */
          this.eventBus.$emit('stationCodeChange', this.form.stationPermission)
          this.form.stationPermission = {}
        }
        if (this.flowKey === 'station_relocation') {
          /*
          如果是站点迁址
          * 原最近投注站nearestStationCodeOld,通过站点获取
          需要根据nearestStationCodeOld获取nearestStationCategoryOld,
          同时置空nearestStationCode
          nearestStationCode,nearestStationCategory,nearestStationDistan
          * */
          this.$set(this.form, 'nearestStationCode', '')

          let data2 = {
            stationCode: this.form.nearestStationCodeOld
          }

          let res2 = await this.$api.queryStationAllInfoByCode({ data: data2 })
          this.$set(this.form, 'nearestStationCategoryOld', res2.data.stationCategory)

        }
        if (this.flowKey === 'rightStationGameNightProcess' || this.flowKey === 'udcompent') {
          //udcompent这个是测试流程
          // rightStationGameNightProcess游戏夜间销售权限流程
          this.eventBus.$emit('stationCodeChange', this.form.stationPermission)
        }

        // 撤站，查询站点结算余额
        if (this.flowKey === 'repeal_station') {
          const _res = await this.$api.queryStationBalance({ data })
          let balance = (_res && _res.code === 0) ? _res.data : ''
          this.$set(this.form, 'stationBalance', balance)
        }

        // 停开机，查询站点折旧费、代销费率、可用余额下限
        if (this.flowKey === 'stationStopBootProcess2') {
          const _res = await this.$api.getStationStopBootInfo({ data })
          let d = (_res && _res.code === 0) ? _res.data : {}
          this.$set(this.form, 'depreciation', d.depreciation || '')
          this.$set(this.form, 'saleCommission', d.saleCommission || '')
          this.$set(this.form, 'accountLimit', d.accountLimit || '')
        }

      },
      // 获取站点类型列表
      async getStationList(sCode) {
        if (!sCode) return
        let data = {
          stationCode: sCode
        }
        let res = await this.$api.queryStationCode({ data })
        if (res && res.code == 0) {
          // console.log(res)
          this.stationList = res.data
        }
        // if (sCode) {
        //   this.stationList = [
        //     {
        //       stationCode: '40010001',
        //       stationStatus: 'open',
        //       stationStatusDic: 'station.stationStatus',
        //       stationOwner: '张淦'
        //     },
        //     {
        //       station_code: '65015042',
        //       name_x: '胡兴才2',
        //       station_status: 'boot',
        //       status_name: '开机'
        //     },
        //     {
        //       station_code: '65015043',
        //       name_x: '胡兴才3',
        //       station_status: 'boot',
        //       status_name: '开机'
        //     },
        //     {
        //       station_code: '65015044',
        //       name_x: '胡兴才4',
        //       station_status: 'boot',
        //       status_name: '开机'
        //     }
        //   ]
        //   // this.postJson('station', {
        //   //   apiCode: 300019,
        //   //   content: {
        //   //     searchKey: sCode
        //   //   }
        //   // }).then(res => {
        //   //   if (res.code === '0') {
        //   //     this.stationList = res.content
        //   //   }
        //   // })
        // }
      },
      // 获取停机站点列表
      async getStopStationList(sCode) {
        if (!sCode) return
        let data = {
          stationCode: sCode
        }
        let res = await this.$api.queryStopStationCode({ data })
        if (res && res.code == 0) {
          this.stationList = res.data
        }
      },
      backFileId(id, prop) {
        this.$set(this.form, prop, id);
      },
      handleRemove() {},
      async uploadFile(files) {
        let formData = new FormData();
        this.softData[3].value = `${(files.file.size / 1024).toFixed(1)} KB`;
        formData.append('file', files.file);
        formData.append('refId', 1);
        formData.append('flag', true);
        formData.append('busType', 1);
        const res = await this.$api.testUpload({
          timeout: 99999999999999,
          data: formData,
          onUploadProgress(evt) {
            // console.log('上传进度事件:', evt);
          }
        });
        // console.log('uploadFile', res);
        // this.gameBagId = res.data.fileId;
      },
      changeCheckbox(val) {
        // console.log(val);
      },
      checkNumber(val, flag) {
        if (this.form[val] < 0) {
          this.$message.warning(`${flag}须大于0`);
        }
      },
      success(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      changeDate(val) {
        this.form[val.options[0]] = moment(this.dateParam[val.prop][0]).format(
          'YYYY-MM-DD'
        );
        this.form[val.options[1]] = moment(this.dateParam[val.prop][1]).format(
          'YYYY-MM-DD'
        );
      },
      changeTime(val) {
        this.form[val.options[0]] = moment(this.timeParam[val.prop][0]).format(
          'YYYY-MM-DD HH:mm:ss'
        );
        this.form[val.options[1]] = moment(this.timeParam[val.prop][1]).format(
          'YYYY-MM-DD HH:mm:ss'
        );
      },
      changeRadio(val) {
        // console.log(val)
        // this.form[val.prop] = this.radioParam[val.prop];
      },
      changeCity(val) {
        // console.log(val)
        // console.log(this.form)
        // const self = this;
        // self.cityData.forEach(item => {
        //   if (item.code == val[0]) {
        //     self.form.provinceId = item.code;
        //     self.form.provinceName = item.name;
        //     item.children.forEach(list => {
        //       if (list.code == val[1]) {
        //         self.form.cityId = list.code;
        //         self.form.cityName = list.name;
        //         list.children.forEach(el => {
        //           if (el.code == val[2]) {
        //             self.form.townId = el.code;
        //             self.form.townName = el.name;
        //           }
        //         });
        //       }
        //     });
        //   }
        // });
      },
      resetForm() {
        this.$refs.form.resetFields();
        if (this.$refs.commonCascader) {
          this.$refs['commonCascader'].forEach(item => {
            item.clear()
          })
          // this.$refs['commonCascader'][0].clear()
        }
      },
      clearValidate(itemProp) {
        console.log(this.$refs)
        this.$refs.form.clearValidate([itemProp])
      },
      validate(callback) {
        this.$refs.form.validate((valid, checkObj) => {
          // setTimeout(() => {
          //   this.clearValidate('additionalItems')
          // }, 10)
          // let countNum = 0
          // console.log(this.checkboxprops)
          // console.log(checkObj)
          // if (!checkObj) {
          //   callback('true')
          // }
          // this.checkboxprops.forEach((val) => {
          //   // 假如对象中含有此prop，判断是否有is not a string
          //   if (checkObj[val]) {
          //     if (checkObj[val][0].message.search('is not a string') != -1) {
          //       setTimeout(() => {
          //         this.clearValidate(checkObj[val][0].field)
          //       }, 10)
          //       console.log(checkObj[val])
          //       countNum++
          //     }
          //   }
          // })
          // console.log(this.checkboxprops)
          // console.log(countNum)
          // 假如，字段中有类型是checkbox的
          // if (this.checkboxprops.length > 0 && countNum == this.checkboxprops.length) {
          //   this.clearCheckboxV()
          //   callback('true')
          // }
          if (valid) {
            // console.log('校验通过');
            // this.$emit('asset')
            callback('true');
          } else {
            // console.log('校验不通过');
            callback('false');
          }
        });
      },
      changeSwitch(val) {
        this.switchText = val ? '开启' : '关闭';
      },
      changeSelect(val) {
        // console.log(val)
        this.form[val.prop] = this.selectParam[val.prop];
        // console.log(this.selectParam)
      },
      async dealData(arr) {
        const self = this
        arr = arr || []
        arr.forEach(item => {
          // console.log(item)
          if (item.stationCode) {
            self.$set(self.form, 'stationCode', item.stationCode);
          }
          if (
            item.type == 'datepicker-range' ||
            item.type == 'datetime-range'
          ) {
            if (item.value != '') {
              // 数据回填
              self.timeParam[item.prop] = item.value;
              self.dateParam[item.prop] = item.value;
            } else {
              self.$set(self.form, item.options[0], '');
              self.$set(self.form, item.options[1], '');
              // self.timeParam[item.type] = item.options; // 用于获取起止时间的字段名称
              // console.log('时间参数', self.timeParam);
            }
          } else if (item.type == 'switch') {
            if (item.value !== '') {
              // 数据回填
              self.changeSwitch(item.value);
              self.$set(self.form, item.prop, item.value);
            } else {
              self.$set(self.form, item.prop, 0);
            }
          } else if (item.type == 'radio') {
            if (item.value !== '') {
              // 数据回填
              self.$set(self.radioParam, item.prop, item.value);
              self.$set(self.form, item.prop, item.value);
            } else {
              self.$set(self.form, item.prop, '');
              self.$set(self.radioParam, item.prop, '');
            }
          } else if (item.type == 'address') {
            // console.log(item)
            if (item.value !== '') {
              // 数据回填
              self.citySelect = item.value;
              // console.log(self.citySelect)
              self.$set(self.form, item.prop, item.value);
              this.cityKey++
            } else {
              // self.$set(self.form, 'provinceId', '');
              // self.$set(self.form, 'provinceName', '');
              // self.$set(self.form, 'cityId', '');
              // self.$set(self.form, 'cityName', '');
              // self.$set(self.form, 'townId', '');
              // self.$set(self.form, 'townName', '');
              // self.$set(self.form, 'address', '');
            }
          } else if (item.type == 'select') {
            // value为0(int)是'' 这里要用 !==
            if (item.value !== '') {
              // 数据回填
              self.$set(self.selectParam, item.prop, item.value);
              self.$set(self.form, item.prop, item.value);
            } else {
              self.$set(self.form, item.prop, '');
              self.$set(self.selectParam, item.prop, '');
            }
          } else if (item.type == 'checkbox') {
            // console.log(item)
            if (item.value !== '') {
              // 数据回填
              self.$set(self.form, item.prop, item.value);
            } else {
              self.$set(self.form, item.prop, []);
            }
          } else if (item.type == 'radio-textarea') {
            if (item.value !== '') {
              // 数据回填
              self.$set(self.form, item.props[0], item.value[0]);
              self.$set(self.form, item.props[1], item.value[1]);
            } else {
              self.$set(self.form, item.props[0], '');
              self.$set(self.form, item.props[1], '');
            }
          } else if (item.type == 'cascader-multiple') {
            if (item.value !== '') {
              // 数据回填
              self.$set(self.form, item.prop, item.value);
            } else {
              self.$set(self.form, item.prop, []);
            }
            self.$set(self.cascaderParams, item.prop, '');
          } else if (item.type == 'cascader') {
            if (item.value !== '') {
              // 数据回填
              self.$set(self.form, item.prop, item.value);
            } else {
              self.$set(self.form, item.prop, '');
            }
            self.$set(self.cascaderParam, item.prop, '');
          } else if (item.type == 'cascader-object') {
            if (item.value !== '') {
              // 数据回填
              self.$set(self.form, item.prop, item.value);
            } else {
              self.$set(self.form, item.prop, []);
            }
            // self.$set(self.cascaderParam, item.prop , '');
          } else if (item.type == 'upload') {
            // console.log(item)
            if (item.value !== '') {
              // 数据回填
              self.$set(self.form, item.prop, item.value);
            } else {
              self.$set(self.form, item.prop, '');
            }
            // self.$set(self.cascaderParam, item.prop , '');
          } else if (item.type == 'winDetail') {
            if (item.value !== '') {
              // 数据回填
              self.$set(self.form, item.prop, item.value);
            } else {
              self.$set(self.form, item.prop, '');
            }
            self.$set(self.form, 'transferSumAmount', item.transferSumAmount);
          } else if (item.type == 'newStationRate') {
            if (item.value !== '' && item.value.length > 0) {
              // 数据回填
              self.$set(self.form, item.prop, item.value);
            } else {
              // self.$set(self.form, item.prop, '');
              this.$api.getGameScope({}).then(res => {
                let arr = []
                res.data.forEach((val, i) => {
                  val.gameName = val.label
                  val.gameId = val.value
                  arr.push(val)
                })
                self.$set(self.form, item.prop, arr);
              })
            }
          } else {
            if (item.value !== '') {
              // 数据回填
              self.$set(self.form, item.prop, item.value);
            } else {
              self.$set(self.form, item.prop, '');
            }
          }
        });
      },
      init(data) {
        const self = this;
        data &&
        data.forEach(item => {
          self.dealData(item.actDeModelFormList)
        })
        // 获取游戏数据
        this.$api.getGameScope({}).then(res => {
          let arr = []
          res.data.forEach((val, i) => {
            val.label = val.text
            val.gameId = val.value
            arr.push(val)
          })
          this.gameTypeList = arr
        })
        // this.findCheckboxProps()
      }
    }
  };
</script>

<style lang="less" scoped>
  .flex-wrap {
    display: flex;
    align-items: center;
  }
</style>
