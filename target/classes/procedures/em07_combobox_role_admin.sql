CREATE OR REPLACE FUNCTION audit.em07_combobox_role_admin()
 RETURNS refcursor
 LANGUAGE plpgsql
AS $function$
DECLARE
  po_cursor                   REFCURSOR;
BEGIN
	 OPEN po_cursor FOR
       SELECT  role_code
               , CASE role_name
               WHEN 'accounting' THEN 'บัญชี'
               WHEN 'T1 approve' THEN 'ผู้อนุมัติ'
               WHEN 'T1 prepare document' THEN 'เอกสาร'
               WHEN 'T1 call center' THEN 'คอลเซ็นเตอร์'
               WHEN 'T1 prepare product' THEN 'จัดเตรียมของ'
               WHEN 'Technical' THEN 'ช่าง'
               WHEN 'T1 Sim management' THEN 'ซิมการ์ด'
               ELSE role_name
               END AS role_name
       FROM role_useradmin
       WHERE role_name NOT LIKE 'admin'
       ORDER BY role_code ASC;
     RETURN po_cursor;
END 
$function$
