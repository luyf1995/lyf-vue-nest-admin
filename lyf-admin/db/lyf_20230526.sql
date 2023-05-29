-- 创建表的工作交由prisma完成，这里只初始化表的数据

-- 初始化角色表数据
INSERT INTO role (id, name, code, sort, create_time, update_time) VALUES (1, '系统管理员', 'admin', 0, sysdate(), sysdate());

-- 初始化用户表数据
INSERT INTO sys_user (id, username, password, nickname, sex, status, create_time, update_time, is_delete) VALUES 
	(1, "admin", "$2b$10$Somjr8/8n2xG5L0UEhKnAeSDT3ekKz1cJkHSmk.RMk8WpG5knRf4O", "系统管理员", 3, 1, sysdate(), sysdate(), false);

-- 初始化用户-角色表数据
INSERT into user_role (user_id, role_id) VALUES (1, 1);

-- 初始化权限表数据
INSERT INTO permission (id, code, name, type, parent_id, create_time, update_time, sort) VALUES (1, NULL, '系统管理', 1, 0, sysdate(), sysdate(), 1);
INSERT INTO permission (id, code, name, type, parent_id, create_time, update_time, sort) VALUES (2, 'system:user', '用户管理', 2, 1, sysdate(), sysdate(), 1);
INSERT INTO permission (id, code, name, type, parent_id, create_time, update_time, sort) VALUES	(3, 'system:dept', '部门管理', 2, 1, sysdate(), sysdate(), 2);
INSERT INTO permission (id, code, name, type, parent_id, create_time, update_time, sort) VALUES (4, 'system:role', '角色管理', 2, 1, sysdate(), sysdate(), 3);
INSERT INTO permission (id, code, name, type, parent_id, create_time, update_time, sort) VALUES (5, 'system:permission', '权限管理', 2, 1, sysdate(), sysdate(), 4);
INSERT INTO permission (id, code, name, type, parent_id, create_time, update_time, sort) VALUES (6, 'system:user:query', '用户查询', 3, 2, sysdate(), sysdate(), 1);
INSERT INTO permission (id, code, name, type, parent_id, create_time, update_time, sort) VALUES (7, 'system:user:add', '用户新增', 3, 2, sysdate(), sysdate(), 2);
INSERT INTO permission (id, code, name, type, parent_id, create_time, update_time, sort) VALUES (8, 'system:user:edit', '用户编辑', 3, 2, sysdate(), sysdate(), 3);
INSERT INTO permission (id, code, name, type, parent_id, create_time, update_time, sort) VALUES (9, 'system:user:delete', '用户删除', 3, 2, sysdate(), sysdate(), 4);
INSERT INTO permission (id, code, name, type, parent_id, create_time, update_time, sort) VALUES (10, 'system:user:resetPassword', '重置密码', 3, 2, sysdate(), sysdate(), 5);
INSERT INTO permission (id, code, name, type, parent_id, create_time, update_time, sort) VALUES (11, 'system:dept:query', '部门查询', 3, 3, sysdate(), sysdate(), 1);
INSERT INTO permission (id, code, name, type, parent_id, create_time, update_time, sort) VALUES (12, 'system:dept:add', '部门新增', 3, 3, sysdate(), sysdate(), 2);
INSERT INTO permission (id, code, name, type, parent_id, create_time, update_time, sort) VALUES (13, 'system:dept:edit', '部门编辑', 3, 3, sysdate(), sysdate(), 3);
INSERT INTO permission (id, code, name, type, parent_id, create_time, update_time, sort) VALUES (14, 'system:dept:delete', '部门删除', 3, 3, sysdate(), sysdate(), 4);
INSERT INTO permission (id, code, name, type, parent_id, create_time, update_time, sort) VALUES (15, 'system:role:query', '角色查询', 2, 4, sysdate(), sysdate(), 1);
INSERT INTO permission (id, code, name, type, parent_id, create_time, update_time, sort) VALUES (16, 'system:role:add', '角色新增', 2, 4, sysdate(), sysdate(), 2);
INSERT INTO permission (id, code, name, type, parent_id, create_time, update_time, sort) VALUES (17, 'system:role:edit', '角色编辑', 3, 4, sysdate(), sysdate(), 3);
INSERT INTO permission (id, code, name, type, parent_id, create_time, update_time, sort) VALUES (18, 'system:role:delete', '角色删除', 2, 4, sysdate(), sysdate(), 4);
INSERT INTO permission (id, code, name, type, parent_id, create_time, update_time, sort) VALUES (19, 'system:permission:query', '权限查询', 3, 5, sysdate(), sysdate(), 1);
INSERT INTO permission (id, code, name, type, parent_id, create_time, update_time, sort) VALUES (20, 'system:permission:add', '权限新增', 3, 5, sysdate(), sysdate(), 2);
INSERT INTO permission (id, code, name, type, parent_id, create_time, update_time, sort) VALUES (21, 'system:permission:edit', '权限编辑', 3, 5, sysdate(), sysdate(), 3);
INSERT INTO permission (id, code, name, type, parent_id, create_time, update_time, sort) VALUES (22, 'system:permission:delete', '权限删除', 3, 5, sysdate(), sysdate(), 4);








