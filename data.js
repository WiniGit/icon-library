"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapGroupData = void 0;
const express_1 = require("express");
const crudDA_1 = __importStar(require("../da/crudDA"));
const login_1 = __importDefault(require("../function/login"));
const tableDA_1 = __importDefault(require("../da/tableDA"));
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const integrationDA_1 = __importDefault(require("../da/integrationDA"));
const convert_1 = require("../Ultis/convert");
const ktx_1 = require("../custom/ktx");
const settingDA_1 = require("../da/settingDA");
const itm_1 = require("../custom/itm");
const router = (0, express_1.Router)();
const _Login = new login_1.default();
const _tbModule = new tableDA_1.default(`data`);
_tbModule.removeIndex().then((_) => __awaiter(void 0, void 0, void 0, function* () {
    yield _tbModule.buildIndex(settingDA_1.settingDataContructor);
}));
/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *           enum: [account, phone, apple, google, microsoft]
 *           description: Loại đăng nhập người dùng
 *         token:
 *           type: string
 *           description: Token xác thực cho đăng nhập bên thứ ba
 *         deviceToken:
 *           type: string
 *           description: Token thiết bị cho push notification
 *         ggClientId:
 *           type: string
 *           description: Google Client ID cho đăng nhập Google
 *         phone:
 *           type: string
 *           description: Số điện thoại người dùng
 *         password:
 *           type: string
 *           description: Mật khẩu người dùng
 *         email:
 *           type: string
 *           description: Email người dùng
 *       example:
 *         type: "account"
 *         phone: "0901234567"
 *         password: "password123"
 *
 *     TokenResponse:
 *       type: object
 *       properties:
 *         code:
 *           type: integer
 *           description: Mã trạng thái
 *         message:
 *           type: string
 *           description: Thông báo kết quả
 *         data:
 *           type: object
 *           properties:
 *             accessToken:
 *               type: string
 *               description: JWT access token
 *             refreshToken:
 *               type: string
 *               description: JWT refresh token
 *       example:
 *         code: 200
 *         message: "Success"
 *         data:
 *           accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *           refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         code:
 *           type: integer
 *           description: Mã lỗi
 *         message:
 *           type: string
 *           description: Thông báo lỗi
 *       example:
 *         code: 401
 *         message: "Missing password"
 *
 *     CheckPasswordRequest:
 *       type: object
 *       properties:
 *         phone:
 *           type: string
 *           description: Số điện thoại người dùng
 *         password:
 *           type: string
 *           description: Mật khẩu cần kiểm tra
 *         email:
 *           type: string
 *           description: Email người dùng
 *       example:
 *         phone: "0901234567"
 *         password: "password123"
 *
 *     RefreshTokenRequest:
 *       type: object
 *       properties:
 *         refreshToken:
 *           type: string
 *           description: JWT refresh token
 *       example:
 *         refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *
 *     ListQueryRequest:
 *       type: object
 *       properties:
 *         searchRaw:
 *           type: string
 *           description: Câu truy vấn tìm kiếm (xem thêm cú pháp tại https://www.notion.so/Redis-1b33d4d4b181800190d4e0b243f38c7a)
 *         page:
 *           type: integer
 *           description: Số trang
 *         size:
 *           type: integer
 *           description: Số lượng kết quả trên mỗi trang
 *         returns:
 *           type: array
 *           items:
 *             type: string
 *           description: Danh sách trường cần trả về
 *         sortby:
 *           type: string
 *           description: Trường sắp xếp
 *       example:
 *         searchRaw: "*"
 *         page: 1
 *         size: 10
 *         returns: ["Id", "Name", "Email"]
 *         sortby: { BY: "DateCreated", DIRECTION: "DESC" }
 *
 *     AggregateRequest:
 *       type: object
 *       properties:
 *         page:
 *           type: integer
 *           description: Số trang
 *         size:
 *           type: integer
 *           description: Số lượng kết quả trên mỗi trang
 *         sortby:
 *           type: string
 *           description: Trường sắp xếp
 *         searchRaw:
 *           type: string
 *           description: Câu truy vấn tìm kiếm (xem thêm cú pháp tại https://www.notion.so/Redis-1b33d4d4b181800190d4e0b243f38c7a)
 *         filter:
 *           type: string
 *           description: Bộ lọc bổ sung
 *         returns:
 *           type: array
 *           items:
 *             type: string
 *           description: Danh sách trường cần trả về
 *       example:
 *         page: 1
 *         size: 10
 *         sortby: [{prop: "DateCreated", direction: "DESC" }, {prop: "Sort", direction: "ASC" }]
 *         searchRaw: "*"
 *         filter: "APPLY exists(@Name) AS __exist FILTER (@__exist == 1)"
 *         returns: ["Id", "Name", "Email"]
 *
 *     PatternRequest:
 *       type: object
 *       properties:
 *         page:
 *           type: integer
 *           description: Số trang
 *         size:
 *           type: integer
 *           description: Số lượng kết quả trên mỗi trang
 *         sortby:
 *           type: string
 *           description: Trường sắp xếp
 *         searchRaw:
 *           type: string
 *           description: Câu truy vấn tìm kiếm (xem thêm cú pháp tại https://www.notion.so/Redis-1b33d4d4b181800190d4e0b243f38c7a)
 *         pattern:
 *           type: object
 *           properties:
 *             returns:
 *               type: array
 *               items:
 *                 type: string
 *               description: Danh sách trường cần trả về của module này
 *             RelativeKey:
 *               type: array
 *               items:
 *                 type: string
 *               description: Khoa chính cần trả về
 *             FKKey:
 *               type: object
 *               properties:
 *                 searchRaw:
 *                   type: string
 *                   description: Câu truy vấn tìm kiếm (xem thêm cú pháp tại https://www.notion.so/Redis-1b33d4d4b181800190d4e0b243f38c7a)
 *                 reducers:
 *                   type: string
 *                   description: Câu truy vấn GROUPBY AGGREGATE (xem thêm cú pháp tại https://www.notion.so/Redis-1b33d4d4b181800190d4e0b243f38c7a)
 *       example:
 *         page: 1
 *         size: 10
 *         sortby: [{prop: "DateCreated", direction: "DESC" }, {prop: "Sort", direction: "ASC" }]
 *         searchRaw: "*"
 *         filter: "APPLY exists(@Name) AS __exist FILTER (@__exist == 1)"
 *         pattern: { returns: ["Id", "Name", "DateCreated", "Type"], CustomerId: ["Id", "Name", "Email"], Lesson: { searchRaw: "*", reducers: "GROUPBY 1 @CourseId REDUCE COUNT 0 AS total" } }
 *
 *     OTPRequest:
 *       type: object
 *       properties:
 *         phone:
 *           type: string
 *           description: Số điện thoại nhận OTP
 *         expiresIn:
 *           type: integer
 *           description: Thời gian hết hạn (milliseconds)
 *       example:
 *         phone: "0901234567"
 *         expiresIn: 600000
 *
 *     VerifyOTPRequest:
 *       type: object
 *       properties:
 *         phone:
 *           type: string
 *           description: Số điện thoại
 *         otp:
 *           type: string
 *           description: Mã OTP
 *       example:
 *         phone: "0901234567"
 *         otp: "123456"
 *
 *     GroupRequest:
 *       type: object
 *       properties:
 *         reducers:
 *           type: string
 *           description: Câu truy vấn reducer
 *         searchRaw:
 *           type: string
 *           description: Câu truy vấn tìm kiếm
 *       example:
 *         reducers: "GROUPBY 1 @Category REDUCE COUNT 0 AS total"
 *         searchRaw: "*"
 *
 *     EvalRequest:
 *       type: object
 *       properties:
 *         script:
 *           type: string
 *           description: Script cần thực thi
 *         keys:
 *           type: array
 *           items:
 *             type: string
 *           description: Danh sách keys
 *         args:
 *           type: array
 *           items:
 *             type: string
 *           description: Danh sách tham số
 *       example:
 *         script: "return redis.call('get', KEYS[1])"
 *         keys: ["user:1"]
 *         args: []
 *
 *     ActionRequest:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             type: object
 *           description: Dữ liệu cần xử lý
 *         ids:
 *           type: array
 *           items:
 *             type: string
 *           description: Danh sách ID
 *       example:
 *         data: [{"Id": "123", "Name": "User 1"}]
 *         ids: ["123", "456"]
 *
 *   parameters:
 *     pidHeader:
 *       in: header
 *       name: pid
 *       schema:
 *         type: string
 *       required: true
 *       description: ID của project
 *     moduleHeader:
 *       in: header
 *       name: module
 *       schema:
 *         type: string
 *       required: true
 *       description: Tên module
 *     authorizationHeader:
 *       in: header
 *       name: authorization
 *       schema:
 *         type: string
 *       required: true
 *       description: Bearer token xác thực
 *
 */
/**
 * @swagger
 * /data/login:
 *   post:
 *     summary: Đăng nhập hoặc đăng ký tài khoản mới
 *     description: Hỗ trợ nhiều phương thức đăng nhập bao gồm tài khoản, số điện thoại, Google, Apple, Microsoft
 *     tags: [Authentication]
 *     parameters:
 *       - $ref: '#/components/parameters/pidHeader'
 *       - $ref: '#/components/parameters/moduleHeader'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TokenResponse'
 *       401:
 *         description: Thiếu thông tin đăng nhập
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Mật khẩu không đúng
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Không tìm thấy project
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const { pid, module } = req.headers;
    const _moduleRepo = new crudDA_1.default(`data:${pid}:${module}`);
    const { type, token, deviceToken, ggClientId, phone, password, email, username } = req.body;
    if (type === "account") {
        if (!password)
            return res.send({ code: 401, message: "Missing password" });
        if (!phone && !email && !username)
            return res.send({ code: 401, message: "Missing phone or email or username" });
        if (phone) {
            const userLogin = (yield _moduleRepo.search(1, 1, `@Mobile:("${phone}")`));
            var userLoginData = (_a = userLogin.data) === null || _a === void 0 ? void 0 : _a[0];
            if (!userLogin)
                return res.send({ code: 401, message: "Phone number is not registered" });
        }
        else if (email) {
            const userLogin = (yield _moduleRepo.search(1, 1, `@Email:("${email}")`));
            userLoginData = (_b = userLogin.data) === null || _b === void 0 ? void 0 : _b[0];
            if (!userLogin)
                return res.send({ code: 401, message: "Email is not registered" });
        }
        else {
            const userLogin = (yield _moduleRepo.search(1, 1, `@UserName:("${username}")`));
            userLoginData = (_c = userLogin.data) === null || _c === void 0 ? void 0 : _c[0];
            if (!userLogin)
                return res.send({ code: 401, message: "Username is not registered" });
        }
        const isMatch = yield _Login.verifyPassword(password, (_d = userLoginData.Password) !== null && _d !== void 0 ? _d : "");
        if (!isMatch) {
            return res.send({ code: 403, message: "Invalid password" });
        }
        else {
            const payload = { id: userLoginData.Id, mobile: userLoginData.Mobile };
            const accessToken = _Login.createAccessToken(payload);
            const refreshToken = _Login.createRefreshToken(payload);
            return res.status(200).json({ data: { accessToken, refreshToken }, code: 200, message: "Success" });
        }
    }
    else if (type === "phone" && phone) {
        const userLogin = (yield _moduleRepo.search(1, 1, `@Mobile:("${phone}")`, { RETURN: ["Id", "UserName", "Mobile"] }));
        if (userLogin.count) {
            const payload = { id: userLogin.data[0].Id, mobile: userLogin.data[0].Mobile };
            const accessToken = _Login.createAccessToken(payload);
            const refreshToken = _Login.createRefreshToken(payload);
            return res.status(200).json({ data: { accessToken, refreshToken }, code: 200, message: "Success" });
        }
        else {
            const newCustomer = {
                Id: (0, convert_1.randomGID)(),
                Name: phone,
                DateCreated: Date.now(),
                Mobile: phone,
                Status: 1,
            };
            yield _moduleRepo.action("add", [newCustomer]);
            const accessToken = _Login.createAccessToken({ id: newCustomer.Id, email: newCustomer.Mobile });
            const refreshToken = _Login.createRefreshToken({ id: newCustomer.Id, email: newCustomer.Mobile });
            return res.status(200).json({ code: 200, message: "Success", data: { accessToken, refreshToken } });
        }
    }
    else if (pid) {
        const integration = new integrationDA_1.default(pid);
        const _projectRepo = new crudDA_1.default(`wini:Project`);
        const projectData = (yield _projectRepo.getById(pid));
        if (!projectData)
            return res.send({ code: 404, message: "Project not found" });
        const response = yield integration.login({ type, token, deviceToken, ggClientId, clientSecret: projectData.ClientSecret });
        if (response.code === 200 && ((_e = response.data) === null || _e === void 0 ? void 0 : _e.email)) {
            const payload = response.data;
            const checkEmail = yield _moduleRepo.search(1, 1, `@Email:("${payload.email}")`);
            let _customer = {};
            switch (type) {
                case "apple":
                    _customer.IdUserApple = (_f = payload.sub) !== null && _f !== void 0 ? _f : "";
                    break;
                case "google":
                    _customer.IdUserGoogle = (_g = payload.sub) !== null && _g !== void 0 ? _g : "";
                    break;
                case "microsoft":
                    _customer.IdUserMicrsoft = (_h = payload.sub) !== null && _h !== void 0 ? _h : "";
                    break;
                default:
                    break;
            }
            if (checkEmail.count) {
                _customer = Object.assign(Object.assign({}, checkEmail.data[0]), _customer);
                if (deviceToken) {
                    _customer.DeviceToken = checkEmail.data[0].DeviceToken
                        ? [
                            ...checkEmail.data[0].DeviceToken.split(",")
                                .slice(1)
                                .filter((tk) => tk !== deviceToken),
                            deviceToken,
                        ].join(",")
                        : deviceToken;
                }
            }
            else {
                _customer = Object.assign(Object.assign({}, _customer), { Id: (0, convert_1.randomGID)(), Email: payload.email, Name: payload.name, AvatarUrl: payload.picture, DateCreated: Date.now(), DeviceToken: deviceToken });
            }
            yield _moduleRepo.action("add", [_customer]);
            const accessToken = _Login.createAccessToken({ id: _customer.Id, email: payload.Email });
            const refreshToken = _Login.createRefreshToken({ id: _customer.Id, email: payload.Email });
            return res.status(200).json({ code: 200, message: "Success", data: { accessToken, refreshToken } });
        }
        else
            return res.send(response);
    }
    return res.send({ code: 404, message: "Missing pid" });
}));
/**
 * @swagger
 * /data/checkPassword:
 *   post:
 *     summary: Kiểm tra tính hợp lệ của mật khẩu
 *     description: Xác minh mật khẩu của người dùng thông qua email hoặc số điện thoại
 *     tags: [Authentication]
 *     parameters:
 *       - $ref: '#/components/parameters/pidHeader'
 *       - $ref: '#/components/parameters/moduleHeader'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CheckPasswordRequest'
 *     responses:
 *       200:
 *         description: Mật khẩu hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Valid password"
 *       401:
 *         description: Thiếu thông tin đăng nhập
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Mật khẩu không đúng
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/checkPassword", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const { pid, module } = req.headers;
    const _moduleRepo = new crudDA_1.default(`data:${pid}:${module}`);
    const { phone, password, email, username } = req.body;
    if (!password)
        return res.send({ code: 401, message: "Missing password" });
    if (!phone && !email && !username)
        return res.send({ code: 401, message: "Missing phone or email or username" });
    if (phone) {
        const userLogin = (yield _moduleRepo.search(1, 1, `@Mobile:("${phone}")`));
        var userLoginData = (_a = userLogin.data) === null || _a === void 0 ? void 0 : _a[0];
        if (!userLoginData)
            return res.send({ code: 401, message: "Phone number is not registered" });
    }
    else if (email) {
        const userLogin = (yield _moduleRepo.search(1, 1, `@Email:("${email}")`));
        userLoginData = (_b = userLogin.data) === null || _b === void 0 ? void 0 : _b[0];
        if (!userLoginData)
            return res.send({ code: 401, message: "Email is not registered" });
    }
    else {
        const userLogin = (yield _moduleRepo.search(1, 1, `@UserName:("${username}")`));
        userLoginData = (_c = userLogin.data) === null || _c === void 0 ? void 0 : _c[0];
        if (!userLogin)
            return res.send({ code: 401, message: "Username is not registered" });
    }
    const isMatch = yield _Login.verifyPassword(password, (_d = userLoginData.Password) !== null && _d !== void 0 ? _d : "");
    if (!isMatch) {
        return res.send({ code: 403, message: "Invalid password" });
    }
    else {
        return res.status(200).json({ code: 200, message: "Valid password" });
    }
}));
/**
 * @swagger
 * /data/bcrypt:
 *   get:
 *     summary: Mã hóa mật khẩu
 *     description: Tạo chuỗi mật khẩu đã mã hóa bằng bcrypt
 *     tags: [Authentication]
 *     parameters:
 *       - in: query
 *         name: password
 *         required: true
 *         schema:
 *           type: string
 *         description: Mật khẩu cần mã hóa
 *     responses:
 *       200:
 *         description: Mã hóa thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Success"
 *                 data:
 *                   type: string
 *                   example: "$2b$10$X7SLU7CrUX.4Ojm6h0ucTuDWYX4jyAtMmA2n2QsKxNxQX4bI9L3Bm"
 *       404:
 *         description: Thiếu mật khẩu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/bcrypt", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { password } = req.query;
    if (password) {
        const result = yield _Login.hashPassword(password);
        return res.send({ code: 200, message: "Success", data: result });
    }
    return res.send({ code: 404, message: "Missing password" });
}));
/**
 * @swagger
 * /data/getInfo:
 *   get:
 *     summary: Lấy thông tin người dùng
 *     description: Lấy thông tin người dùng dựa trên token
 *     tags: [Users]
 *     parameters:
 *       - $ref: '#/components/parameters/pidHeader'
 *       - $ref: '#/components/parameters/moduleHeader'
 *       - $ref: '#/components/parameters/authorizationHeader'
 *     responses:
 *       200:
 *         description: Lấy thông tin thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Success"
 *                 data:
 *                   type: object
 *                   description: Thông tin người dùng
 */
router.get("/getInfo", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { authorization, pid, module } = req.headers;
    const _moduleRepo = new crudDA_1.default(`data:${pid}:${module}`);
    const payload = _Login.verifyToken((authorization !== null && authorization !== void 0 ? authorization : "").replace("Bearer", "").trim());
    const customer = yield _moduleRepo.getById(payload.id);
    return res.status(200).json({ code: 200, message: "Success", data: customer });
}));
/**
 * @swagger
 * /data/refreshToken:
 *   post:
 *     summary: Làm mới token
 *     description: Tạo access token mới từ refresh token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshTokenRequest'
 *     responses:
 *       200:
 *         description: Làm mới token thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TokenResponse'
 *       401:
 *         description: Refresh token không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/refreshToken", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.body;
    const response = yield _Login.refreshToken(refreshToken);
    return res.send(response);
}));
/**
 * @swagger
 * /data/getAll:
 *   get:
 *     summary: Lấy tất cả dữ liệu
 *     description: Lấy tất cả bản ghi từ module được chỉ định
 *     tags: [Data]
 *     parameters:
 *       - $ref: '#/components/parameters/pidHeader'
 *       - $ref: '#/components/parameters/moduleHeader'
 *     responses:
 *       200:
 *         description: Lấy dữ liệu thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Success"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                   description: Danh sách dữ liệu
 */
router.get("/getAll", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { pid, module } = req.headers;
    const _moduleRepo = new crudDA_1.default(`data:${pid}:${module}`);
    const results = yield _moduleRepo.getAll();
    return res.status(200).json({ data: results, code: 200, message: "Success" });
}));
/**
 * @swagger
 * /data/getListSimple:
 *   post:
 *     summary: Tìm kiếm dữ liệu với bộ lọc
 *     description: Tìm kiếm và phân trang dữ liệu với các tùy chọn
 *     tags: [Data]
 *     parameters:
 *       - $ref: '#/components/parameters/pidHeader'
 *       - $ref: '#/components/parameters/moduleHeader'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ListQueryRequest'
 *     responses:
 *       200:
 *         description: Tìm kiếm thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Success"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                   description: Danh sách kết quả
 *                 totalCount:
 *                   type: integer
 *                   description: Tổng số bản ghi
 */
router.post("/getListSimple", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { pid, module } = req.headers;
    if (module) {
        var _moduleRepo = new crudDA_1.default(`data:${pid}:${module}`);
    }
    else {
        _moduleRepo = new crudDA_1.default(`data`);
    }
    const { searchRaw, page, size, returns, sortby } = req.body;
    const results = yield _moduleRepo.search(page, size, searchRaw, { RETURN: returns, SORTBY: sortby });
    if (results.code !== 404) {
        return res.status(200).json({ data: results.data, totalCount: results.count, code: 200, message: "Success" });
    }
    else
        return res.send(results);
}));
/**
 * @swagger
 * /data/aggregateList:
 *   post:
 *     summary: Truy vấn dữ liệu tổng hợp
 *     description: Thực hiện truy vấn tổng hợp dữ liệu với các bộ lọc và tùy chọn phân trang
 *     tags: [Data]
 *     parameters:
 *       - $ref: '#/components/parameters/pidHeader'
 *       - $ref: '#/components/parameters/moduleHeader'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AggregateRequest'
 *     responses:
 *       200:
 *         description: Truy vấn thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Success"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                   description: Kết quả truy vấn
 *                 totalCount:
 *                   type: integer
 *                   description: Tổng số bản ghi
 */
router.post("/aggregateList", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { pid, module } = req.headers;
    const { page, size, sortby, searchRaw, filter, returns } = req.body;
    if (crudDA_1.regexEmptyKeyController.test(searchRaw)) {
        const firstEmptyKey = crudDA_1.regexEmptyKeyController.exec(searchRaw);
        const notEmpty = firstEmptyKey[0].includes("notempty");
        const key = firstEmptyKey[1];
        let _searchRaw = searchRaw.replace(crudDA_1.replaceEmptyKeyController, "").trim();
        if (!_searchRaw.length)
            _searchRaw = `*`;
        const response = yield aggregateData({ pid: pid, module: module, searchRaw: _searchRaw, filter: `APPLY exists(@${key}) AS __exist FILTER (@__exist == ${notEmpty ? 1 : 0})`, page, size, sortby, returns });
        if (response.totalCount) {
            const _moduleRepo = new crudDA_1.default(`data:${pid}:${module}`);
            const totalRes = yield _moduleRepo.aggregate({ searchRaw: _searchRaw, query: `LOAD * APPLY exists(@${key}) AS __exist FILTER (@__exist == ${notEmpty ? 1 : 0}) GROUPBY 1 @__exist REDUCE COUNT 0 AS _totalCount` });
            const newTotalCount = (_a = totalRes[1]) === null || _a === void 0 ? void 0 : _a.pop();
            return res.status(200).send({
                data: response.data.map((e) => {
                    const tmp = Object.assign({}, e);
                    delete tmp.__exist;
                    return tmp;
                }),
                totalCount: newTotalCount ? parseInt(newTotalCount) : response.totalCount,
                code: 200,
                message: "Success",
            });
        }
        else
            return res.send(response);
    }
    else {
        const response = yield aggregateData({ pid: pid, module: module, page, size, sortby, searchRaw, filter, returns });
        return res.status(200).send(response);
    }
}));
/**
 * @swagger
 * /data/patternList:
 *   post:
 *     summary: Truy vấn dữ liệu theo yêu cầu.
 *     description: Truy vấn theo yêu cầu truyền vào pattern ở body
 *     tags: [Data]
 *     parameters:
 *       - $ref: '#/components/parameters/pidHeader'
 *       - $ref: '#/components/parameters/moduleHeader'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PatternRequest'
 *     responses:
 *       200:
 *         description: Truy vấn thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Success"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                   description: Kết quả truy vấn
 *                 totalCount:
 *                   type: integer
 *                   description: Tổng số bản ghi
 *
 * */
router.post("/patternList", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { pid, module } = req.headers;
    const { page, size, sortby, searchRaw, filter, pattern } = req.body;
    if (!pid || !module)
        return res.send({ code: 404, message: "Missing pid or module" });
    let getModuleData = { data: [], totalCount: 0 };
    // lấy data của bảng module theo aggregate
    if (crudDA_1.regexEmptyKeyController.test(searchRaw)) {
        const firstEmptyKey = crudDA_1.regexEmptyKeyController.exec(searchRaw);
        const notEmpty = firstEmptyKey[0].includes("notempty");
        const key = firstEmptyKey[1];
        let _searchRaw = searchRaw.replace(crudDA_1.replaceEmptyKeyController, "").trim();
        if (!_searchRaw.length)
            _searchRaw = `*`;
        const response = yield aggregateData({ pid: pid, module: module, searchRaw: _searchRaw, filter: `APPLY exists(@${key}) AS __exist FILTER (@__exist == ${notEmpty ? 1 : 0})`, returns: pattern === null || pattern === void 0 ? void 0 : pattern.returns, page, size, sortby });
        if (response.totalCount) {
            const _moduleRepo = new crudDA_1.default(`data:${pid}:${module}`);
            const totalRes = yield _moduleRepo.aggregate({ searchRaw: _searchRaw, query: `LOAD * APPLY exists(@${key}) AS __exist FILTER (@__exist == ${notEmpty ? 1 : 0}) GROUPBY 1 @__exist REDUCE COUNT 0 AS _totalCount` });
            const newTotalCount = (_a = totalRes[1]) === null || _a === void 0 ? void 0 : _a.pop();
            getModuleData = { data: response.data, totalCount: newTotalCount ? parseInt(newTotalCount) : response.totalCount };
        }
        else
            return res.send(response);
    }
    else {
        const response = yield aggregateData({ pid: pid, module: module, returns: pattern === null || pattern === void 0 ? void 0 : pattern.returns, page, size, sortby, searchRaw, filter });
        if (response.code !== 200)
            return res.status(200).send(response);
        getModuleData = { data: response.data, totalCount: response.totalCount };
    }
    if (pattern) {
        // từ pattern lấy danh sách các bảng PK và FK cần xử lý
        const pkModules = {};
        const fkModules = {};
        Object.keys(pattern).forEach((p) => {
            var _a;
            if (p !== "returns") {
                if (p.endsWith("Id")) {
                    if (!((_a = pattern === null || pattern === void 0 ? void 0 : pattern.returns) === null || _a === void 0 ? void 0 : _a.length) || pattern.returns.includes(p))
                        pkModules[p] = pattern[p];
                }
                else
                    fkModules[p] = pattern[p];
            }
        });
        // khai báo relativeData: đây là biến lưu các dữ liệu được redis trả về theo bảng PK và FK đã lấy ra ở trên
        let relativeData = [];
        let tableName = [];
        // gộp tất cả promise getByListId của bảng PK và relativeData
        if (Object.keys(pkModules).length) {
            tableName = Object.keys(pkModules).map((e) => e.substring(0, e.lastIndexOf("Id")));
            relativeData.push(...Object.keys(pkModules).map((e, i) => {
                const isParent = e === "ParentId" || tableName[i] === module;
                const mRepo = new crudDA_1.default(`data:${pid}:${isParent ? module : tableName[i]}`);
                return mRepo.getBylistId(getModuleData.data
                    .map((item) => { var _a; return (isParent ? item.ParentId : (_a = item[e]) === null || _a === void 0 ? void 0 : _a.split(",")); })
                    .flat(Infinity)
                    .filter((id, i, arr) => !!(id === null || id === void 0 ? void 0 : id.length) && arr.indexOf(id) === i));
            }));
        }
        // gộp tất cả promise group của bảng FK và relativeData
        if (Object.keys(fkModules).length) {
            const fkSearch = `@${module}Id:{${getModuleData.data.map((e) => e.Id).join(" | ")}}`;
            relativeData.push(...Object.keys(fkModules).map((e) => {
                var _a;
                let parentSearch;
                if (e === module)
                    parentSearch = `@ParentId:{${getModuleData.data.map((e) => e.Id).join(" | ")}}`;
                const efkSearch = ((_a = fkModules[e].searchRaw) === null || _a === void 0 ? void 0 : _a.length) ? fkModules[e].searchRaw : "*";
                return (0, exports.mapGroupData)(pid, e, fkModules[e].reducers, efkSearch !== "*" ? `${parentSearch !== null && parentSearch !== void 0 ? parentSearch : fkSearch} ${efkSearch}` : parentSearch !== null && parentSearch !== void 0 ? parentSearch : fkSearch);
            }));
        }
        // xử lý dữ liệu mà promise trả ra
        if (relativeData.length) {
            relativeData = yield Promise.all(relativeData);
            relativeData.slice(0, tableName.length).forEach((relativeResponse, i) => {
                getModuleData[tableName[i]] = relativeResponse
                    .filter((e) => e !== undefined && e !== null)
                    .map((e) => {
                    const tmp = {};
                    tmp.Id = e.Id;
                    pkModules[`${tableName[i]}Id`].forEach((pkProps) => (tmp[pkProps] = e[pkProps]));
                    return tmp;
                });
            });
            const fkRelativeData = relativeData
                .slice(tableName.length)
                .filter((e) => e.code === 200 && e.data.length)
                .map((e) => e.data)
                .flat(Infinity);
            getModuleData.data = getModuleData.data.map((e) => {
                let tmpE = Object.assign({}, e);
                fkRelativeData
                    .filter((fkE) => { var _a, _b; return (_b = ((_a = fkE[`${module}Id`]) !== null && _a !== void 0 ? _a : fkE.ParentId)) === null || _b === void 0 ? void 0 : _b.includes(e.Id); })
                    .forEach((fkE) => {
                    const tmpFKE = Object.assign({}, fkE);
                    delete tmpFKE[`${module}Id`];
                    delete tmpFKE.ParentId;
                    tmpE = Object.assign(Object.assign({}, tmpE), tmpFKE);
                });
                return tmpE;
            });
        }
    }
    return res.status(200).send(Object.assign(Object.assign({}, getModuleData), { code: 200, message: "Success" }));
}));
router.post("/filterByEmptyKey", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { pid, module } = req.headers;
    const { page, size, sortby, searchRaw, key, notEmpty } = req.body;
    const _moduleRepo = new crudDA_1.default(`data:${pid}:${module}`);
    const response = yield aggregateData({ pid: pid, module: module, page: page, size: size, sortby: sortby, searchRaw: searchRaw, filter: `APPLY exists(@${key}) AS __exist FILTER (@__exist == ${notEmpty ? 1 : 0})` });
    if (response.totalCount) {
        const totalRes = yield _moduleRepo.aggregate({ searchRaw: searchRaw, query: `LOAD * APPLY exists(@${key}) AS __exist FILTER (@__exist == ${notEmpty ? 1 : 0}) GROUPBY 1 @__exist REDUCE COUNT 0 AS _totalCount` });
        const newTotalCount = (_a = totalRes[1]) === null || _a === void 0 ? void 0 : _a.pop();
        return res.status(200).send({ data: response.data, totalCount: newTotalCount ? parseInt(newTotalCount) : response.totalCount, code: 200, message: "Success" });
    }
    else
        return res.send(response);
}));
/**
 * @swagger
 * /data/send-otp:
 *   post:
 *     summary: Gửi mã OTP
 *     description: Gửi mã OTP đến số điện thoại
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OTPRequest'
 *     responses:
 *       200:
 *         description: Gửi OTP thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "OTP sent successfully!"
 *                 sessionInfo:
 *                   type: string
 *                   description: Thông tin phiên
 *       400:
 *         description: Thiếu số điện thoại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Phone number is required."
 *       500:
 *         description: Lỗi khi gửi OTP
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to send OTP."
 *                 error:
 *                   type: string
 *                   description: Thông báo lỗi
 */
router.post("/send-otp", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { phone, expiresIn } = req.body;
    if (!phone) {
        return res.status(400).json({ message: "Phone number is required." });
    }
    try {
        // Firebase does not send OTP directly through Admin SDK. You need to implement client-side
        const sessionInfo = yield firebase_admin_1.default.auth().createSessionCookie(phone, {
            expiresIn: expiresIn !== null && expiresIn !== void 0 ? expiresIn : 10 * 60 * 1000, // 30s validity
        });
        // Return a session cookie or session info to the client
        return res.status(200).json({
            message: "OTP sent successfully!",
            sessionInfo,
        });
    }
    catch (error) {
        console.error("Error sending OTP:", error);
        return res.status(500).json({
            message: "Failed to send OTP.",
            error: error.message,
        });
    }
}));
/**
 * @swagger
 * /data/check-otp:
 *   post:
 *     summary: Xác minh mã OTP
 *     description: Kiểm tra tính hợp lệ của mã OTP
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyOTPRequest'
 *     responses:
 *       200:
 *         description: OTP hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "OTP Verified Successfully!"
 *       400:
 *         description: Thiếu thông tin
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Phone number and OTP are required."
 *       401:
 *         description: OTP không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid OTP or Phone Number!"
 *       500:
 *         description: Lỗi xác minh OTP
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "OTP Verification Failed."
 *                 error:
 *                   type: string
 *                   description: Thông báo lỗi
 */
router.post("/check-otp", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
        return res.status(400).json({ message: "Phone number and OTP are required." });
    }
    try {
        // Verify the OTP using Firebase
        const verificationResult = yield firebase_admin_1.default.auth().verifyIdToken(otp);
        if (verificationResult.phone_number === phone) {
            return res.status(200).json({ message: "OTP Verified Successfully!" });
        }
        else {
            return res.status(401).json({ message: "Invalid OTP or Phone Number!" });
        }
    }
    catch (error) {
        console.error("Error verifying OTP:", error);
        return res.status(500).json({ message: "OTP Verification Failed.", error: error.message });
    }
}));
/**
 * @swagger
 * /data/group:
 *   post:
 *     summary: Nhóm dữ liệu
 *     description: Thực hiện truy vấn nhóm dữ liệu
 *     tags: [Data]
 *     parameters:
 *       - $ref: '#/components/parameters/pidHeader'
 *       - $ref: '#/components/parameters/moduleHeader'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GroupRequest'
 *     responses:
 *       200:
 *         description: Truy vấn thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Success"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                   description: Kết quả truy vấn
 *                 totalCount:
 *                   type: integer
 *                   description: Tổng số bản ghi
 *       404:
 *         description: Lỗi truy vấn
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/group", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { pid, module } = req.headers;
    const { reducers, searchRaw } = req.body;
    const response = yield (0, exports.mapGroupData)(pid, module, reducers, searchRaw);
    return res.send(response);
}));
/**
 * @swagger
 * /data/getById:
 *   post:
 *     summary: Lấy dữ liệu theo ID
 *     description: Tìm và trả về dữ liệu theo ID
 *     tags: [Data]
 *     parameters:
 *       - $ref: '#/components/parameters/pidHeader'
 *       - $ref: '#/components/parameters/moduleHeader'
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của bản ghi cần lấy
 *     responses:
 *       200:
 *         description: Lấy dữ liệu thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Success"
 *                 data:
 *                   type: object
 *                   description: Dữ liệu bản ghi
 *       404:
 *         description: Không tìm thấy ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/getById", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { pid, module } = req.headers;
    const { id } = req.query;
    const _moduleRepo = new crudDA_1.default(`data:${pid}:${module}`);
    if (id) {
        const results = yield _moduleRepo.getById(id);
        return res.status(200).json({ data: results, code: 200, message: "Success" });
    }
    else {
        return res.send({ code: 404, message: "Missing id" });
    }
}));
/**
 * @swagger
 * /data/getByIds:
 *   post:
 *     summary: Lấy nhiều bản ghi theo danh sách ID
 *     description: Tìm và trả về nhiều bản ghi theo danh sách ID
 *     tags: [Data]
 *     parameters:
 *       - $ref: '#/components/parameters/pidHeader'
 *       - $ref: '#/components/parameters/moduleHeader'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Danh sách ID cần lấy
 *             example:
 *               ids: ["123", "456"]
 *     responses:
 *       200:
 *         description: Lấy dữ liệu thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Success"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                   description: Danh sách bản ghi
 *       404:
 *         description: Thiếu danh sách ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/getByIds", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { pid, module } = req.headers;
    const { ids } = req.body;
    const _moduleRepo = new crudDA_1.default(`data:${pid}:${module}`);
    if (ids) {
        const results = yield _moduleRepo.getBylistId(ids);
        return res.status(200).json({ data: results, code: 200, message: "Success" });
    }
    else {
        return res.send({ code: 404, message: "Missing ids" });
    }
}));
/**
 * @swagger
 * /data/eval:
 *   post:
 *     summary: Thực thi script
 *     description: Thực thi script tùy chỉnh với keys và arguments
 *     tags: [Advanced]
 *     parameters:
 *       - $ref: '#/components/parameters/pidHeader'
 *       - $ref: '#/components/parameters/moduleHeader'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EvalRequest'
 *     responses:
 *       200:
 *         description: Thực thi thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Success"
 *                 data:
 *                   type: object
 *                   description: Kết quả thực thi
 *       404:
 *         description: Lỗi thực thi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/eval", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { pid, module } = req.headers;
    const { script, keys, args } = req.body;
    const _moduleRepo = new crudDA_1.default(`data:${pid}:${module}`);
    try {
        const results = yield _moduleRepo.eval(script, { arguments: args, keys: keys });
        return res.status(200).send({ data: results, code: 200, message: "Success" });
    }
    catch (error) {
        return res.send({ code: 404, message: error === null || error === void 0 ? void 0 : error.message });
    }
}));
/**
 * @swagger
 * /data/action:
 *   post:
 *     summary: Thực hiện thao tác dữ liệu
 *     description: Thêm, sửa, nhân bản hoặc xóa dữ liệu
 *     tags: [Data]
 *     parameters:
 *       - $ref: '#/components/parameters/pidHeader'
 *       - $ref: '#/components/parameters/moduleHeader'
 *       - $ref: '#/components/parameters/authorizationHeader'
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *           enum: [add, edit, duplicate, delete]
 *         required: true
 *         description: Loại thao tác
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ActionRequest'
 *     responses:
 *       200:
 *         description: Thao tác thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Success"
 *                 data:
 *                   type: object
 *                   description: Dữ liệu sau khi thực hiện thao tác
 *       404:
 *         description: Lỗi thực hiện thao tác
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/action", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const { authorization, pid, module } = req.headers;
    const _moduleRepo = new crudDA_1.default(`data:${pid}:${module}`);
    const { action } = req.query;
    const { data, ids } = req.body;
    switch (`${action}`.toLowerCase()) {
        case "add":
            try {
                if (data.some((e) => !(e === null || e === void 0 ? void 0 : e.Id) || Object.keys(e).some((p) => e[p] && typeof e[p] === "object")))
                    return res.send({ code: 404, message: "Wrong data type or missing Id" });
                yield _moduleRepo.action("add", data);
                (0, ktx_1.ktxNotifications)({ pid: pid, module: module, data: data, action: "add", ids: ids, authorization: authorization });
                (0, itm_1.itmNotifications)({ pid: pid, module: module, data: data, action: "add", ids: ids, authorization: authorization });
                return res.status(200).json({ data: data, code: 200, message: "Success" });
            }
            catch (error) {
                return res.send({ code: 404, message: (_a = error.message) !== null && _a !== void 0 ? _a : "" });
            }
        case "edit":
            try {
                if (data.some((e) => !(e === null || e === void 0 ? void 0 : e.Id) || Object.keys(e).some((p) => e[p] && typeof e[p] === "object")))
                    return res.send({ code: 404, message: "Wrong data type or missing Id" });
                yield Promise.all([(0, ktx_1.ktxNotifications)({ pid: pid, module: module, data: data, action: "edit", ids: ids, authorization: authorization }), (0, itm_1.itmNotifications)({ pid: pid, module: module, data: data, action: "edit", ids: ids, authorization: authorization })]);
                yield _moduleRepo.action("edit", data);
                return res.status(200).json({ data: data, code: 200, message: "Success" });
            }
            catch (error) {
                return res.send({ code: 404, message: (_b = error.message) !== null && _b !== void 0 ? _b : "" });
            }
        case "duplicate":
            try {
                const currentData = yield _moduleRepo.getBylistId(ids);
                yield _moduleRepo.action("add", currentData.map((e) => (Object.assign(Object.assign({}, e), { Id: (0, convert_1.randomGID)(), DateCreated: Date.now(), Name: `${e.Name} - Copy` }))));
                return res.status(200).json({ data: data, code: 200, message: "Success" });
            }
            catch (error) {
                return res.send({ code: 404, message: (_c = error.message) !== null && _c !== void 0 ? _c : "" });
            }
        case "delete":
            try {
                yield (0, ktx_1.ktxNotifications)({ pid: pid, module: module, data: data, action: "delete", ids: ids, authorization: authorization });
                yield _moduleRepo.delete(ids);
                const _relRepo = new crudDA_1.default(`setting:${pid}:rel`);
                _relRepo.search(1, 1000, `@TablePK:{${module}} @DeleteFK:{true}`, { RETURN: ["TableFK"] }).then((res) => __awaiter(void 0, void 0, void 0, function* () {
                    var _a;
                    if ((_a = res.data) === null || _a === void 0 ? void 0 : _a.length) {
                        for (const item of res.data) {
                            const _moduleFKRepo = new crudDA_1.default(`data:${pid}:${item.TableFK}`);
                            _moduleFKRepo
                                .aggregate({
                                searchRaw: `@${module === item.TableFK ? "Parent" : module}Id:{${ids.join(" | ")}}`,
                                query: `GROUPBY 1 @Id`,
                            })
                                .then((res) => {
                                if ((res === null || res === void 0 ? void 0 : res.code) !== 404) {
                                    const childrenIds = res.filter((e) => { var _a; return Array.isArray(e) && ((_a = e[1]) === null || _a === void 0 ? void 0 : _a.length); }).map((e) => e[1]);
                                    _moduleFKRepo.delete(childrenIds);
                                }
                            });
                        }
                    }
                }));
                return res.status(200).json({ data: ids, code: 200, message: "Success" });
            }
            catch (error) {
                return res.send({ code: 404, message: (_d = error.message) !== null && _d !== void 0 ? _d : "" });
            }
        default:
            return res.send({ code: 404, message: "Invalid action" });
    }
}));
router.post("/buildIndex", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { pid, module } = req.headers;
    const { properties } = req.body;
    const _tableRepo = new tableDA_1.default(`data:${pid}:${module}`);
    yield _tableRepo.removeIndex();
    try {
        yield _tableRepo.buildIndex(properties);
        return res.status(200).json({ code: 200, message: "Success" });
    }
    catch (error) {
        return res.send({ code: 404, message: error.message });
    }
}));
router.post("/removeIndex", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { pid, module } = req.headers;
    const _tableRepo = new tableDA_1.default(`data:${pid}:${module}`);
    try {
        yield _tableRepo.removeIndex();
        return res.status(200).json({ code: 200, message: "Success" });
    }
    catch (error) {
        return res.send({ code: 404, message: error.message });
    }
}));
const _settingModule = ["chart", "card", "form", "view", "report"];
router.post("/:settingModule/action", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const { settingModule } = req.params;
    if (_settingModule.includes(settingModule)) {
        const { pid } = req.headers;
        var _moduleRepo = new crudDA_1.default(`data:${pid}:data_${settingModule}`);
        const { action } = req.query;
        const { data, ids } = req.body;
        switch (action) {
            case "add":
                try {
                    yield _moduleRepo.action("add", data);
                    return res.status(200).json({ data: data, code: 200, message: "Success" });
                }
                catch (error) {
                    return res.send({ code: 404, message: (_a = error.message) !== null && _a !== void 0 ? _a : "" });
                }
            case "edit":
                try {
                    yield _moduleRepo.action("add", data);
                    return res.status(200).json({ data: data, code: 200, message: "Success" });
                }
                catch (error) {
                    return res.send({ code: 404, message: (_b = error.message) !== null && _b !== void 0 ? _b : "" });
                }
            case "delete":
                if (ids === null || ids === void 0 ? void 0 : ids.length) {
                    try {
                        yield _moduleRepo.delete(ids);
                        return res.status(200).json({ data: ids, code: 200, message: "Success" });
                    }
                    catch (error) {
                        return res.send({ code: 404, message: (_c = error.message) !== null && _c !== void 0 ? _c : "" });
                    }
                }
                else
                    return res.send({ code: 404, message: "Missing ids!" });
            default:
                return res.send({ code: 404, message: "Invalid action" });
        }
    }
    else
        return res.status(404).send({ code: 404, message: "Page not found" });
}));
router.post("/:settingModule/getListSimple", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { settingModule } = req.params;
    if (_settingModule.includes(settingModule)) {
        const { pid } = req.headers;
        const _moduleRepo = new crudDA_1.default(`data:${pid}:data_${settingModule}`);
        const { searchRaw, page, size, returns, sortby } = req.body;
        const results = yield _moduleRepo.search(page, size, searchRaw, { RETURN: returns, SORTBY: sortby });
        if (results.code !== 404) {
            return res.status(200).json({ data: results.data, totalCount: results.count, code: 200, message: "Success" });
        }
        else
            return res.send({ code: 404, message: results.message });
    }
    else
        return res.status(404).send({ code: 404, message: "Page not found" });
}));
router.post("/:settingModule/getByIds", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { settingModule } = req.params;
    if (_settingModule.includes(settingModule)) {
        const { pid } = req.headers;
        const _moduleRepo = new crudDA_1.default(`data:${pid}:data_${settingModule}`);
        const { ids } = req.body;
        if (ids === null || ids === void 0 ? void 0 : ids.length) {
            const results = yield _moduleRepo.getBylistId(ids);
            return res.status(200).json({ data: results, code: 200, message: "Success" });
        }
        else {
            return res.send({ code: 404, message: "Missing ids" });
        }
    }
    else
        return res.status(404).send({ code: 404, message: "Page not found" });
}));
router.post("/:settingModule/group", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { settingModule } = req.params;
    if (_settingModule.includes(settingModule)) {
        const { pid } = req.headers;
        const _moduleRepo = new crudDA_1.default(`data:${pid}:data_${settingModule}`);
        const { reducers, searchRaw } = req.body;
        const results = yield _moduleRepo.aggregate({
            searchRaw: searchRaw,
            query: reducers,
        });
        if ((results === null || results === void 0 ? void 0 : results.code) !== 404) {
            const _totalCount = results.shift();
            if (_totalCount) {
                const _data = results.map((e) => {
                    let _jsonItem = {};
                    for (let i = 0; i < e.length; i += 2) {
                        if (e[i] === "$") {
                            let _parseJson = {};
                            try {
                                _parseJson = JSON.parse(e[i + 1]);
                            }
                            catch (error) {
                                console.log("parse $ failed");
                            }
                            _jsonItem = Object.assign(Object.assign({}, _jsonItem), _parseJson);
                        }
                        else {
                            _jsonItem[e[i]] = e[i + 1];
                        }
                    }
                    return _jsonItem;
                });
                return res.status(200).json({ data: _data, totalCount: _totalCount, code: 200, message: "Success" });
            }
            else {
                return res.status(200).json({ data: [], totalCount: 0, code: 200, message: "Success" });
            }
        }
        else {
            return res.send({ code: 404, message: (_a = results.message) !== null && _a !== void 0 ? _a : "group error" });
        }
    }
}));
function aggregateData(props) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        const _sortBy = (_a = props.sortby) !== null && _a !== void 0 ? _a : [{ prop: "DateCreated", direction: "DESC" }];
        const _moduleRepo = new crudDA_1.default(`data:${props.pid}:${props.module}`);
        const _tbColRepo = new crudDA_1.default(`setting:${props.pid}:column`);
        let _queryCols = yield _tbColRepo.aggregate({
            searchRaw: `@TableName:{${props.module}} (-@Name:{Id | Name | DateCreated})`,
            query: `LOAD 3 @Id @Name @Query APPLY exists(@Query) AS __exist FILTER (@__exist == 1) APPLY strlen(@Query) AS qlength FILTER (@qlength > 0)`,
        });
        let _query = "";
        if ((_queryCols === null || _queryCols === void 0 ? void 0 : _queryCols.code) !== 404 && _queryCols.shift() && _queryCols.length) {
            const _queryList = _queryCols.map((e) => {
                let _jsonItem = {};
                for (let i = 0; i < e.length; i += 2) {
                    if (e[i] === "$") {
                        let _parseJson = {};
                        try {
                            _parseJson = JSON.parse(e[i + 1]);
                        }
                        catch (error) {
                            console.log("parse $ failed");
                        }
                        _jsonItem = Object.assign(Object.assign({}, _jsonItem), _parseJson);
                    }
                    else {
                        _jsonItem[e[i]] = e[i + 1];
                    }
                }
                return _jsonItem;
            });
            _query = `${_queryList.map((e) => `APPLY ${e.Query} AS ${e.Name}`).join(" ")} `;
        }
        let _size = (_b = props.size) !== null && _b !== void 0 ? _b : 10000;
        let _page = (_c = props.page) !== null && _c !== void 0 ? _c : 1;
        const finalQuery = `LOAD * ` + (props.filter ? `${props.filter} ` : "") + _query + `${_sortBy.length ? `SORTBY ${_sortBy.length * 2} ${_sortBy.map((e) => { var _a; return `@${e.prop} ${(_a = e.direction) !== null && _a !== void 0 ? _a : "ASC"}`; }).join(" ")}` : ""} LIMIT ${(_page - 1) * _size} ${_size}`;
        const results = yield _moduleRepo.aggregate({
            searchRaw: props.searchRaw,
            query: finalQuery,
        });
        if ((results === null || results === void 0 ? void 0 : results.code) !== 404) {
            const _totalCount = results.shift();
            if (_totalCount) {
                const _data = results.map((e) => {
                    var _a, _b;
                    let _jsonItem = {};
                    for (let i = 0; i < e.length; i += 2) {
                        if (e[i] === "$") {
                            let _parseJson = {};
                            try {
                                _parseJson = JSON.parse(e[i + 1]);
                            }
                            catch (error) {
                                console.log("parse $ failed");
                            }
                            if ((_a = props.returns) === null || _a === void 0 ? void 0 : _a.length) {
                                Object.keys(_parseJson).forEach((p) => {
                                    if (!props.returns.includes(p))
                                        delete _parseJson[p];
                                });
                            }
                            _jsonItem = Object.assign(Object.assign({}, _jsonItem), _parseJson);
                        }
                        else if (!((_b = props.returns) === null || _b === void 0 ? void 0 : _b.length) || props.returns.includes(e[i])) {
                            _jsonItem[e[i]] = e[i + 1];
                        }
                    }
                    return _jsonItem;
                });
                return { data: _data, totalCount: _totalCount, code: 200, message: "Success" };
            }
            else
                return { data: [], totalCount: 0, code: 200, message: "Success" };
        }
        else
            return results;
    });
}
const mapGroupData = (pid, module, query, searchRaw) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const mRepo = new crudDA_1.default(`data:${pid}:${module}`);
    const results = yield mRepo.aggregate({ searchRaw: searchRaw !== null && searchRaw !== void 0 ? searchRaw : "*", query: query });
    if ((results === null || results === void 0 ? void 0 : results.code) !== 404) {
        const _totalCount = results.shift();
        if (_totalCount) {
            const _data = results.map((e) => {
                let _jsonItem = {};
                for (let i = 0; i < e.length; i += 2) {
                    if (e[i] === "$") {
                        let _parseJson = {};
                        try {
                            _parseJson = JSON.parse(e[i + 1]);
                        }
                        catch (error) {
                            console.log("parse $ failed");
                        }
                        _jsonItem = Object.assign(Object.assign({}, _jsonItem), _parseJson);
                    }
                    else {
                        _jsonItem[e[i]] = e[i + 1];
                    }
                }
                return _jsonItem;
            });
            return { data: _data, totalCount: _totalCount, code: 200, message: "Success" };
        }
        else {
            return { data: [], totalCount: 0, code: 200, message: "Success" };
        }
    }
    else {
        return { code: 404, message: (_a = results.message) !== null && _a !== void 0 ? _a : "group error" };
    }
});
exports.mapGroupData = mapGroupData;
exports.default = router;
