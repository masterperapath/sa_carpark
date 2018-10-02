CREATE OR REPLACE FUNCTION audit.em11_select_user(pi_groupname character varying, pi_username character varying)
 RETURNS refcursor
 LANGUAGE plpgsql
AS $function$
DECLARE
  po_cursor                   REFCURSOR;
BEGIN
    OPEN po_cursor FOR
  SELECT COALESCE(us.c_username,'-') AS c_username, us.i_user_id, gp.i_group_id, COALESCE(us.authority,'-') AS authority, gp.c_group_name, CASE WHEN i_subgrp_id = 0 THEN FALSE ELSE TRUE END AS subgroup
    , LPAD(gp.i_group_id::VARCHAR, 7, '0') AS groupidLPAD
  FROM user_profile us
   RIGHT JOIN group_profile gp ON us.i_group_id = gp.i_group_id
       WHERE COALESCE(LOWER(gp.c_group_name),'') LIKE '%'||COALESCE(LOWER(pi_groupname),'')||'%'
       AND COALESCE(LOWER(us.c_username),'') LIKE '%'||COALESCE(LOWER(pi_username),'')||'%';
  RETURN po_cursor;
END
$function$
