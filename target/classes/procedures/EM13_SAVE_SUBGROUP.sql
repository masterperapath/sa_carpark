CREATE OR REPLACE FUNCTION audit.EM13_SAVE_SUBGROUP(pi_mid character varying, pi_group_id character varying, pi_subgroup_id character varying, pi_username character varying)
 RETURNS refcursor
 LANGUAGE plpgsql
AS $function$
declare
	v_validate           NUMERIC(15)  := 0;
BEGIN
	
	SELECT 1 
	INTO v_validate
	FROM subgrp_mid_relate
	WHERE i_subgrp_id = pi_subgroup_id::NUMERIC
	AND i_group_id = pi_group_id::NUMERIC
	AND i_mid_id = pi_mid::NUMERIC;

	IF v_validate = 1 THEN
		RAISE EXCEPTION USING ERRCODE = '20900', message = 'MID ซ้ำ กรุณากรอกใหม';
	ELSE 
		INSERT INTO subgrp_mid_relate(i_subgrp_id, i_group_id, i_mid_id, authority, acegi) VALUES (pi_subgroup_id::NUMERIC, pi_group_id::NUMERIC, pi_mid::NUMERIC, 'ADMIN', TRUE);
	END IF;
	
	RETURN audit.em13_select_subgroup_detail(pi_subgroup_id, pi_group_id, pi_username);

END;
$function$
