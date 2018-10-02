CREATE OR REPLACE FUNCTION audit.em11_save_user(pi_username character varying, pi_groupid character varying, pi_authority character varying, pi_subgroup boolean)
 RETURNS refcursor
 LANGUAGE plpgsql
AS $function$
DECLARE
	po_cursor         refcursor;
	v_group_name 	  VARCHAR(50);
	v_username_check  numeric := 0;
	v_password 		  VARCHAR(20);
	v_sub_group_id	  NUMERIC;
BEGIN
	SELECT count(1)
	INTO v_username_check
	FROM user_profile
	WHERE c_username = pi_username;

	IF pi_subgroup = TRUE THEN
		v_sub_group_id := NEXTVAL('audit.subgroupidrelate_seq');
	ELSE
		v_sub_group_id := 0;
	END if;
	
	IF v_username_check = 0 :: NUMERIC THEN
	
	SELECT audit.random_string(3)
	INTO v_password;
	
	INSERT INTO user_profile(c_username, c_password, i_group_id, authority, i_subgrp_id) 
	VALUES (pi_username, v_password, CAST(pi_groupid AS NUMERIC), pi_authority, v_sub_group_id);

	SELECT c_group_name
	INTO v_group_name
	FROM group_profile
	WHERE i_group_id = pi_groupid::NUMERIC;

  	RETURN audit.em11_select_user(v_group_name,null);

	ELSE
	
	OPEN po_cursor FOR SELECT 1 AS CheckUser;
    RETURN po_cursor;  

	END IF;
END;
$function$
