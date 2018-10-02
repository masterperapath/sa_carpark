UPDATE admin_user
SET user_role = 99
WHERE id IN (1,2,3,4,5,6,7,8,9,10
,11,12,13,14,15,16,17,18,19,20
,21,22,23,24,25,26,27,28,29,30
,31,32,33,34,35);

UPDATE admin_user SET user_role = 1 WHERE id IN (36, 45);
UPDATE admin_user SET user_role = 2 WHERE id IN (44);
UPDATE admin_user SET user_role = 3 WHERE id IN (41, 42);
UPDATE admin_user SET user_role = 4 WHERE id IN (39, 40, 43, 46);
UPDATE admin_user SET user_role = 5 WHERE id IN (51);
UPDATE admin_user SET user_role = 6 WHERE id IN (47, 48, 49, 50, 52);