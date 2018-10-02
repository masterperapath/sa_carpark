CREATE OR REPLACE FUNCTION audit.em07_select_admin_user(pi_username VARCHAR, pi_user_role VARCHAR)
 RETURNS refcursor
 LANGUAGE plpgsql
AS $$
DECLARE
  po_cursor                   REFCURSOR;
BEGIN
    OPEN po_cursor FOR
	    SELECT adm.username ,adm.realname ,adm.id,adm.password,adm.displayname,adm.email,adm.send_sumary_mail, adm.user_role
               ,CASE rol.role_name
               WHEN 'accounting' THEN 'บัญชี'
               WHEN 'T1 approve' THEN 'ผู้อนุมัติ'
               WHEN 'T1 prepare document' THEN 'เอกสาร'
               WHEN 'T1 call center' THEN 'คอลเซ็นเตอร์'
               WHEN 'T1 prepare product' THEN 'จัดเตรียมของ'
               WHEN 'Technical' THEN 'ช่าง'
               ELSE rol.role_name
               END AS role_name
        FROM   admin_user adm
        JOIN role_useradmin rol ON rol.role_code = adm.user_role
      	WHERE LOWER(adm.username) LIKE '%'||COALESCE(LOWER(pi_username),'')||'%'
      	AND adm.user_role::VARCHAR LIKE COALESCE(pi_user_role, '%')
      	AND rol.role_code <> 1
      	ORDER BY adm.id ASC;
  RETURN po_cursor;
END
$$
