const matchModel = require("../models/matchModel");
const planModel = require("../models/planModel");
const subscriptionModel = require("../models/subscriptionModel");
const userModel = require("../models/userModel");
const userReportModel = require("../models/userReportModel");
const { before_after_Date } = require("../MyModels/common_model")

const dashboardCount = async (req, res) => {
  try {
    let user = await userModel.find().count();
    let report = await userReportModel.find().count();
    let subscribe = await subscriptionModel.find().count();
    let plan = await planModel.find().count();

    return res.status(200).send({ status: 1, message: "Success", data: { totalUser: user, totalReport: report, totalSubscriber: subscribe, totalPlan: plan } })
  } catch (error) {
    console.log(error)
    return res.status(200).send({ status: 0, message: "Server Error", data: null })
  }
}

const userGraph = async (req, res) => {
  try {
    let frequency = req.body.frequency
    let pipeline = [];
    if (frequency == 'daily') {
      let date = await before_after_Date(-30)

      pipeline = [
        {
          $match: { createdAt: { $gte: new Date(date) } }
        },
        {
          '$group': {
            '_id': {
              'date': {
                '$dayOfYear': '$createdAt'
              }
            },
            'total_user': {
              '$sum': 1
            },
            'createdAt': {
              '$last': '$$ROOT.createdAt'
            }
          }
        }, {
          '$project': {
            'id': {
              '$concat': [
                {
                  '$dateToString': {
                    'date': '$createdAt',
                    'format': '%d '
                  }
                }, {
                  '$switch': {
                    'branches': [
                      {
                        'case': {
                          '$eq': [
                            '01', {
                              '$dateToString': {
                                'date': '$createdAt',
                                'format': '%m'
                              }
                            }
                          ]
                        },
                        'then': 'JAN'
                      }, {
                        'case': {
                          '$eq': [
                            '02', {
                              '$dateToString': {
                                'date': '$createdAt',
                                'format': '%m'
                              }
                            }
                          ]
                        },
                        'then': 'FEB'
                      }, {
                        'case': {
                          '$eq': [
                            '03', {
                              '$dateToString': {
                                'date': '$createdAt',
                                'format': '%m'
                              }
                            }
                          ]
                        },
                        'then': 'MAR'
                      }, {
                        'case': {
                          '$eq': [
                            '04', {
                              '$dateToString': {
                                'date': '$createdAt',
                                'format': '%m'
                              }
                            }
                          ]
                        },
                        'then': 'APR'
                      }, {
                        'case': {
                          '$eq': [
                            '05', {
                              '$dateToString': {
                                'date': '$createdAt',
                                'format': '%m'
                              }
                            }
                          ]
                        },
                        'then': 'MAY'
                      }, {
                        'case': {
                          '$eq': [
                            '06', {
                              '$dateToString': {
                                'date': '$createdAt',
                                'format': '%m'
                              }
                            }
                          ]
                        },
                        'then': 'JUN'
                      }, {
                        'case': {
                          '$eq': [
                            '07', {
                              '$dateToString': {
                                'date': '$createdAt',
                                'format': '%m'
                              }
                            }
                          ]
                        },
                        'then': 'JUL'
                      }, {
                        'case': {
                          '$eq': [
                            '08', {
                              '$dateToString': {
                                'date': '$createdAt',
                                'format': '%m'
                              }
                            }
                          ]
                        },
                        'then': 'AUG'
                      }, {
                        'case': {
                          '$eq': [
                            '09', {
                              '$dateToString': {
                                'date': '$createdAt',
                                'format': '%m'
                              }
                            }
                          ]
                        },
                        'then': 'SEP'
                      }, {
                        'case': {
                          '$eq': [
                            '10', {
                              '$dateToString': {
                                'date': '$createdAt',
                                'format': '%m'
                              }
                            }
                          ]
                        },
                        'then': 'OCT'
                      }, {
                        'case': {
                          '$eq': [
                            '11', {
                              '$dateToString': {
                                'date': '$createdAt',
                                'format': '%m'
                              }
                            }
                          ]
                        },
                        'then': 'NOV'
                      }
                    ],
                    'default': 'DEC'
                  }
                }
              ]
            },
            'total_user': 1,
            'createdAt': 1,
            '_id': 0
          }
        }, {
          '$sort': {
            'createdAt': 1,
            'id': 1
          }
        }
      ]
    } else if (frequency == 'weekly') {
      pipeline = [
        {
          '$group': {
            '_id': {
              'date': {
                '$week': '$createdAt'
              }
            },
            'total_user': {
              '$sum': 1
            },
            'createdAt': {
              '$last': '$$ROOT.createdAt'
            }
          }
        }, {
          '$project': {
            'id': '$_id.date',
            'total_user': 1,
            'createdAt': 1,
            '_id': 0
          }
        }, {
          '$sort': {
            'createdAt': 1,
            'id': 1
          }
        }
      ]

    } else if (frequency == 'monthly') {
      let date = await before_after_Date(-365)
      pipeline = [
        {
          $match: { createdAt: { $gte: new Date(date) } }
        },
        {
          '$group': {
            '_id': {
              'date': {
                '$month': '$createdAt'
              }
            },
            'total_user': {
              '$sum': 1
            },
            'createdAt': {
              '$last': '$$ROOT.createdAt'
            }
          }
        }, {
          '$project': {
            'id': {
              '$switch': {
                'branches': [
                  {
                    'case': {
                      '$eq': [
                        1, '$_id.date'
                      ]
                    },
                    'then': 'JAN'
                  }, {
                    'case': {
                      '$eq': [
                        2, '$_id.date'
                      ]
                    },
                    'then': 'FEB'
                  }, {
                    'case': {
                      '$eq': [
                        3, '$_id.date'
                      ]
                    },
                    'then': 'MAR'
                  }, {
                    'case': {
                      '$eq': [
                        4, '$_id.date'
                      ]
                    },
                    'then': 'APR'
                  }, {
                    'case': {
                      '$eq': [
                        5, '$_id.date'
                      ]
                    },
                    'then': 'MAY'
                  }, {
                    'case': {
                      '$eq': [
                        6, '$_id.date'
                      ]
                    },
                    'then': 'JUN'
                  }, {
                    'case': {
                      '$eq': [
                        7, '$_id.date'
                      ]
                    },
                    'then': 'JUL'
                  }, {
                    'case': {
                      '$eq': [
                        8, '$_id.date'
                      ]
                    },
                    'then': 'AUG'
                  }, {
                    'case': {
                      '$eq': [
                        9, '$_id.date'
                      ]
                    },
                    'then': 'SEP'
                  }, {
                    'case': {
                      '$eq': [
                        10, '$_id.date'
                      ]
                    },
                    'then': 'OCT'
                  }, {
                    'case': {
                      '$eq': [
                        11, '$_id.date'
                      ]
                    },
                    'then': 'NOV'
                  }
                ],
                'default': 'DEC'
              }
            },
            'total_user': 1,
            'createdAt': 1,
            '_id': 0
          }
        }, {
          '$sort': {
            'createdAt': 1,
            'id': 1
          }
        }
      ]
    } else if (frequency == 'quarterly') {
      pipeline = [
        {
          '$group': {
            '_id': {
              'date': {
                'year': {
                  '$year': '$createdAt'
                },
                'id': {
                  '$ceil': {
                    '$divide': [
                      {
                        '$month': '$createdAt'
                      }, 3
                    ]
                  }
                }
              }
            },
            'total_user': {
              '$sum': 1
            },
            'createdAt': {
              '$last': '$$ROOT.createdAt'
            }
          }
        }, {
          '$project': {
            'id': '$_id.date.id',
            'year': '$_id.date.year',
            'total_user': 1,
            'createdAt': 1,
            '_id': 0
          }
        }, {
          '$sort': {
            'createdAt': 1,
            'id': 1
          }
        }
      ]


    } else if (frequency == 'yearly') {
      pipeline = [
        {
          '$group': {
            '_id': {
              'date': {
                '$year': '$createdAt'
              }
            },
            'total_user': {
              '$sum': 1
            },
            'createdAt': {
              '$last': '$$ROOT.createdAt'
            }
          }
        }, {
          '$project': {
            'id': '$_id.date',
            'total_user': 1,
            'createdAt': 1,
            '_id': 0
          }
        }, {
          '$sort': {
            'createdAt': 1,
            'id': 1
          }
        }
      ]
    } else {
      return res.status(200).send({ status: 0, message: "invalid frequency", data: null })
    }
    let response = await userModel.aggregate(pipeline);
    if (response) {

      return res.status(200).send({ status: 1, message: "success", data: response })
    }
  } catch (error) {
    console.log(error)
    return res.status(500).send({ status: 0, message: "server error", data: null })
  }
}

const transectionGraph = async (req, res) => {
  try {
    let frequency = req.body.frequency
    let pipeline = [];
    if (frequency == 'daily') {
      let date = await before_after_Date(-30)
      pipeline = [
        {
          $match: { createdAt: { $gte: new Date(date) } }
        },
        {
          '$group': {
            '_id': { 'date': { '$dayOfYear': '$createdAt' } },
            'total_transection': { '$sum': 1 },
            'amount': { '$sum': '$amount' },
            'createdAt': { '$last': '$$ROOT.createdAt' }
          }
        },
        {
          '$project': {
            'id': {
              '$concat': [{ '$dateToString': { 'date': '$createdAt', 'format': '%d ' } },
              {
                '$switch': {
                  'branches': [
                    { 'case': { '$eq': ['01', { '$dateToString': { 'date': '$createdAt', 'format': '%m' } }] }, 'then': 'JAN' },
                    { 'case': { '$eq': ['02', { '$dateToString': { 'date': '$createdAt', 'format': '%m' } }] }, 'then': 'FEB' },
                    { 'case': { '$eq': ['03', { '$dateToString': { 'date': '$createdAt', 'format': '%m' } }] }, 'then': 'MAR' },
                    { 'case': { '$eq': ['04', { '$dateToString': { 'date': '$createdAt', 'format': '%m' } }] }, 'then': 'APR' },
                    { 'case': { '$eq': ['05', { '$dateToString': { 'date': '$createdAt', 'format': '%m' } }] }, 'then': 'MAY' },
                    { 'case': { '$eq': ['06', { '$dateToString': { 'date': '$createdAt', 'format': '%m' } }] }, 'then': 'JUN' },
                    { 'case': { '$eq': ['07', { '$dateToString': { 'date': '$createdAt', 'format': '%m' } }] }, 'then': 'JUL' },
                    { 'case': { '$eq': ['08', { '$dateToString': { 'date': '$createdAt', 'format': '%m' } }] }, 'then': 'AUG' },
                    { 'case': { '$eq': ['09', { '$dateToString': { 'date': '$createdAt', 'format': '%m' } }] }, 'then': 'SEP' },
                    { 'case': { '$eq': ['10', { '$dateToString': { 'date': '$createdAt', 'format': '%m' } }] }, 'then': 'OCT' },
                    { 'case': { '$eq': ['11', { '$dateToString': { 'date': '$createdAt', 'format': '%m' } }] }, 'then': 'NOV' }
                  ],
                  'default': 'DEC'
                }
              }]
            },
            'total_transection': 1, 'createdAt': 1, 'amount': 1, '_id': 0
          }
        },
        { '$sort': { 'createdAt': 1, 'id': 1 } }
      ]
    } else if (frequency == 'weekly') {
      pipeline = [
        {
          '$group': {
            '_id': {
              'date': {
                '$week': '$createdAt'
              }
            },
            'total_transection': {
              '$sum': 1
            },
            'amount': {
              '$sum': '$amount'
            },
            'createdAt': {
              '$last': '$$ROOT.createdAt'
            }
          }
        }, {
          '$project': {
            'id': '$_id.date',
            'total_transection': 1,
            'createdAt': 1,
            'amount': 1,
            '_id': 0
          }
        }, {
          '$sort': {
            'createdAt': 1,
            'id': 1
          }
        }
      ]
    } else if (frequency == 'monthly') {
      let date = await before_after_Date(-365)
      pipeline = [
        {
          $match: { createdAt: { $gte: new Date(date) } }
        },
        {
          '$group': {
            '_id': {
              'date': {
                '$month': '$createdAt'
              }
            },
            'total_transection': {
              '$sum': 1
            },
            'amount': {
              '$sum': '$amount'
            },
            'createdAt': {
              '$last': '$$ROOT.createdAt'
            }
          }
        }, {
          '$project': {
            'id': {
              '$switch': {
                'branches': [
                  {
                    'case': {
                      '$eq': [
                        1, '$_id.date'
                      ]
                    },
                    'then': 'JAN'
                  }, {
                    'case': {
                      '$eq': [
                        2, '$_id.date'
                      ]
                    },
                    'then': 'FEB'
                  }, {
                    'case': {
                      '$eq': [
                        3, '$_id.date'
                      ]
                    },
                    'then': 'MAR'
                  }, {
                    'case': {
                      '$eq': [
                        4, '$_id.date'
                      ]
                    },
                    'then': 'APR'
                  }, {
                    'case': {
                      '$eq': [
                        5, '$_id.date'
                      ]
                    },
                    'then': 'MAY'
                  }, {
                    'case': {
                      '$eq': [
                        6, '$_id.date'
                      ]
                    },
                    'then': 'JUN'
                  }, {
                    'case': {
                      '$eq': [
                        7, '$_id.date'
                      ]
                    },
                    'then': 'JUL'
                  }, {
                    'case': {
                      '$eq': [
                        8, '$_id.date'
                      ]
                    },
                    'then': 'AUG'
                  }, {
                    'case': {
                      '$eq': [
                        9, '$_id.date'
                      ]
                    },
                    'then': 'SEP'
                  }, {
                    'case': {
                      '$eq': [
                        10, '$_id.date'
                      ]
                    },
                    'then': 'OCT'
                  }, {
                    'case': {
                      '$eq': [
                        11, '$_id.date'
                      ]
                    },
                    'then': 'NOV'
                  }
                ],
                'default': 'DEC'
              }
            },
            'total_transection': 1,
            'createdAt': 1,
            'amount': 1,
            '_id': 0
          }
        }, {
          '$sort': {
            'createdAt': 1,
            'id': 1
          }
        }
      ]
    } else if (frequency == 'quarterly') {
      pipeline = [
        {
          '$group': {
            '_id': {
              'date': {
                'year': {
                  '$year': '$createdAt'
                },
                'id': {
                  '$ceil': {
                    '$divide': [
                      {
                        '$month': '$createdAt'
                      }, 3
                    ]
                  }
                }
              }
            },
            'total_subscription': {
              '$sum': 1
            },
            'createdAt': {
              '$last': '$$ROOT.createdAt'
            }
          }
        }, {
          '$project': {
            'id': '$_id.date.id',
            'year': '$_id.date.year',
            'total_subscription': 1,
            'createdAt': 1,
            '_id': 0
          }
        }, {
          '$sort': {
            'createdAt': 1,
            'id': 1
          }
        }
      ]

    } else {
      pipeline = [
        {
          '$group': {
            '_id': { 'date': { '$year': '$createdAt' } },
            'total_transection': { '$sum': 1 },
            'amount': { '$sum': '$amount' },
            'createdAt': { '$last': '$$ROOT.createdAt' }
          }
        },
        { '$project': { 'id': '$_id.date', 'total_transection': 1, 'createdAt': 1, 'amount': 1, '_id': 0 } },
        { '$sort': { 'createdAt': 1, 'id': 1 } }
      ]
    }

    let response = await subscriptionModel.aggregate(pipeline);
    if (response) {

      return res.status(200).send({ status: 1, message: "success", data: response })
    }

  } catch (error) {
    console.log(error)
    return res.status(500).send({ status: 0, message: "server error", data: null })
  }


} 

const countryWiseUsergraph = async (req, res) => {
  try {
    let pipeline = [

      {
        '$group': {
          '_id': '$country',
          'user': {
            '$sum': 1
          },
          'createdAt': {
            '$last': '$$ROOT.createdAt'
          }
        }
      }, {
        '$project': {
          'id': '$user',
          'country': '$_id',
          '_id': 0
        }
      }, {
        '$sort': {
          'createdAt': 1
        }
      }

    ]
    let result = await userModel.aggregate(pipeline)
    if (result) {
      return res.status(200).send({ status: 1, message: "success", data: result })
    }

  } catch (error) {
    console.log(error)
    return res.status(500).send({ status: 0, message: "server", data: null })

  }
}

module.exports = { dashboardCount, userGraph, transectionGraph, countryWiseUsergraph }

