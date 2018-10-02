CREATE OR REPLACE FUNCTION audit.esu03_select_forgot_password_user(pi_groupname character varying, pi_username character varying, pi_group_id character varying)
 RETURNS refcursor
 LANGUAGE plpgsql
AS $function$
DECLARE
  po_cursor                   REFCURSOR;
  v_sql						  VARCHAR(32000);
BEGIN
	    v_sql := '
    WITH params_table AS (
      SELECT $1 AS group_name,
             $2 AS user_name,
			 $3 AS group_id
    )
      SELECT usr.c_username, grp.c_group_name, COALESCE(grp.c_comment, ''-'') AS c_comment 
		FROM group_profile grp
		JOIN user_profile usr ON (usr.i_group_id = grp.i_group_id)
        JOIN params_table prm ON (1 = 1)
		WHERE grp.i_group_id != 353 AND grp.i_group_id != 330
  ';

  IF pi_groupname IS NOT NULL THEN
    v_sql := v_sql || ' AND ' || 'LOWER(grp.c_group_name)' || ' LIKE ''%'' || LOWER(prm.group_name) || ''%'' ';
  END IF;

  IF pi_username IS NOT NULL THEN
    v_sql := v_sql || ' AND ' || 'LOWER(usr.c_username)' || ' LIKE ''%'' || LOWER(prm.user_name) || ''%'' ';
  END IF;
  
  IF pi_group_id IS NOT NULL THEN
    v_sql := v_sql || ' AND  grp.i_group_id = '||pi_group_id::NUMERIC||'';
  END IF;
  
  	v_sql := v_sql || ' GROUP BY usr.c_username, grp.c_group_name, grp.c_comment ';
  	
  OPEN po_cursor FOR EXECUTE v_sql
        USING pi_groupname
            , pi_username
            , pi_group_id;
		
	RETURN po_cursor;
END
$function$
