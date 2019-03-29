//支付通道费率信息
const paymentChannelRate={
  rate:null,
  fee:null,
  minTransaction:null,
  maxTransaction:null,
  creditRate:null,
  fakeRate:null,
  allowCredit:null,
  autoD0:null
};
//支付通道配置信息
const paymentChannelConfigs={
    "appId": null,
    "account": null,
    "endpoint": null,
    "notifyUrl": null,
    "privateKey": null,
    "publicKey": null,
    "dataKey": null,
    "signKey": null
};
//结算通道费率信息
const settlementRate={
  rate:null,
  fee:null,
  minTransaction:null,
  maxTransaction:null,
  d0Rate:null,
  d0Fee:null,
  allowD0:null
};
//结算通道配置信息
const settlementConfigs={
    "appId": null,
    "account": null,
    "endpoint": null,
    "notifyUrl": null,
    "privateKey": null,
    "publicKey": null,
    "dataKey": null,
    "signKey": null
};
//商户费率信息
const merchantRate ={
      "rate":null,
      "fee":null,
      "minTransaction":null,
      "maxTransaction":null,
      "d0Rate": null,
      "d0Fee": null,
      "allowCredit":null
};
//合作商组
const groupRate={
    rate:null,
    fee:null,
    minTransaction:null,
    maxTransaction:null,
    autoD0:null,
    defaultSaleRate:{
      d0Rate:null,
      d0Fee:null,
      allowCredit:null,
      rate:null,
      fee:null,
      minTransaction:null,
      maxTransaction:null,
    }
}
export {
	paymentChannelRate,
	paymentChannelConfigs,
	settlementRate,
	settlementConfigs,
	merchantRate,
	groupRate
}