require('dotenv').config();
const jwt = require('jsonwebtoken');

const signToken = (user) => {
  return jwt.sign(
    {
      _id: admin._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
};

const isAuth = async (req, res, next) => {

  try {
    const { authorization } = req.headers;
    if (!authorization) return res.status(401).send({
      message: 'Authorization required',
      status: 0,
      data: null,
    });

    const token = authorization?.split(' ')[1];
    if (!token) return res.status(401).send({
      message: 'Authorization required',
      status: 0,
      data: null,
    });

    const decoded = jwt.verify(token, 'admin');
    req.user = decoded;
    req.userID = decoded.userId
    next();
  } catch (err) {
    console.log(err)
    res.status(401).send({
      message: err.message,
      status: 0,
      data: null,
    });
  }
};

const isAuthSocket = async (token) => {

  try {
    
    if (!token) return res.status(401).send({
      message: 'Authorization required',
      status: 0,
      data: null,
    });

    const decoded = jwt.verify(token, 'admin');
    req.user = decoded;
    req.userID = decoded.userId
    next();
  } catch (err) {
    console.log(err)
    res.status(401).send({
      message: err.message,
      status: 0,
      data: null,
    });
  }
};

module.exports = {
  signToken,
  isAuth,
  isAuthSocket
};
